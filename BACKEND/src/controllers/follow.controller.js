const userModel = require("../models/User.model");
const followModel = require("../models/follow.model");
const { sendFollowRequestEmail } = require("../services/email.service");
const { env } = require("../config/env");

function getPublicUser(user) {
  return {
    id: user._id,
    username: user.username,
    profileImage: user.profileImage,
    bio: user.bio,
  };
}

function formatRequest(request, userField) {
  return {
    id: request._id,
    status: request.status,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    user: request[userField],
  };
}

function getEmailStatusMessage(emailSkipped, emailSkipReason) {
  if (!emailSkipped) {
    return "Follow request sent and email notification delivered.";
  }

  const messages = {
    invalid_recipient_email:
      "Follow request sent, but the target account does not have a valid email address.",
    invalid_sender_email:
      "Follow request sent, but EMAIL_FROM must look like email@example.com or Name <email@example.com>.",
    missing_gmail_config:
      "Follow request sent, but Gmail SMTP is missing GMAIL_USER or GMAIL_APP_PASSWORD.",
    provider_error:
      "Follow request sent, but the email provider rejected the notification.",
  };

  return messages[emailSkipReason] || "Follow request sent, but email notification could not be delivered.";
}

async function listUsersController(req, res) {
  const currentUser = await userModel.findById(req.user.id);
  const users = await userModel
    .find({ _id: { $ne: req.user.id } })
    .select("username profileImage bio")
    .lean();

  const [outgoingFollows, incomingFollows] = await Promise.all([
    followModel.find({ follower: req.user.id }).select("followee status").lean(),
    followModel.find({ followee: req.user.id }).select("follower status").lean(),
  ]);

  const outgoingByUserId = new Map(
    outgoingFollows.map((follow) => [follow.followee.toString(), follow.status]),
  );
  const incomingByUserId = new Map(
    incomingFollows.map((follow) => [follow.follower.toString(), follow.status]),
  );

  res.status(200).json({
    currentUser: getPublicUser(currentUser),
    users: users.map((user) => {
      const userId = user._id.toString();
      const outgoingStatus = outgoingByUserId.get(userId);
      const incomingStatus = incomingByUserId.get(userId);

      return {
        ...user,
        followStatus: outgoingStatus || incomingStatus || "none",
        relationshipDirection: outgoingStatus ? "outgoing" : incomingStatus ? "incoming" : "none",
      };
    }),
  });
}

async function listFollowRequestsController(req, res) {
  const [incoming, outgoing, followers, following] = await Promise.all([
    followModel
      .find({ followee: req.user.id, status: "pending" })
      .populate("follower", "username profileImage bio")
      .sort({ createdAt: -1 })
      .lean(),
    followModel
      .find({ follower: req.user.id, status: "pending" })
      .populate("followee", "username profileImage bio")
      .sort({ createdAt: -1 })
      .lean(),
    followModel
      .find({ followee: req.user.id, status: "accepted" })
      .populate("follower", "username profileImage bio")
      .sort({ updatedAt: -1 })
      .lean(),
    followModel
      .find({ follower: req.user.id, status: "accepted" })
      .populate("followee", "username profileImage bio")
      .sort({ updatedAt: -1 })
      .lean(),
  ]);

  res.status(200).json({
    incoming: incoming.map((request) => formatRequest(request, "follower")),
    outgoing: outgoing.map((request) => formatRequest(request, "followee")),
    followers: followers.map((request) => formatRequest(request, "follower")),
    following: following.map((request) => formatRequest(request, "followee")),
  });
}

async function createFollowController(req, res) {
  const { username: targetUsername } = req.params;
  const currentUser = await userModel.findById(req.user.id);
  if (!currentUser) {
    return res.status(401).json({ message: "Authenticated user not found" });
  }

  if (currentUser.username === targetUsername) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  const targetUser = await userModel.findOne({ username: targetUsername });
  if (!targetUser) {
    return res.status(404).json({ message: "User to follow does not exist" });
  }

  const existingFollow = await followModel.findOne({
    follower: currentUser._id,
    followee: targetUser._id,
  });

  if (existingFollow && existingFollow.status !== "rejected") {
    return res
      .status(409)
      .json({ message: `Follow request is already ${existingFollow.status}` });
  }

  const follow =
    existingFollow ||
    (await followModel.create({
      follower: currentUser._id,
      followee: targetUser._id,
      status: "pending",
    }));

  if (existingFollow?.status === "rejected") {
    follow.status = "pending";
    await follow.save();
  }

  const apiBaseUrl = env.apiPublicUrl || `${req.protocol}://${req.get("host")}`;
  const acceptUrl = `${apiBaseUrl}/api/user/follows/${follow._id}/accept`;
  const rejectUrl = `${apiBaseUrl}/api/user/follows/${follow._id}/reject`;

  let emailSkipped = false;
  let emailSkipReason = "";
  try {
    const emailResult = await sendFollowRequestEmail({
      to: targetUser.email,
      targetUsername: targetUser.username,
      requesterUsername: currentUser.username,
      acceptUrl,
      rejectUrl,
    });
    emailSkipped = Boolean(emailResult?.skipped);
    emailSkipReason = emailResult?.reason || "";
  } catch (err) {
    console.error("Follow request email failed:", err);
    emailSkipped = true;
    emailSkipReason = "provider_error";
  }

  return res.status(201).json({
    message: getEmailStatusMessage(emailSkipped, emailSkipReason),
    follow,
    emailSkipped,
    emailSkipReason,
  });
}

async function updateAuthenticatedFollowRequestController(req, res) {
  const { requestId, action } = req.params;
  const follow = await followModel
    .findById(requestId)
    .populate("follower", "username profileImage bio")
    .populate("followee", "username profileImage bio");

  if (!follow) {
    return res.status(404).json({ message: "Follow request not found" });
  }

  if (follow.followee._id.toString() !== req.user.id.toString()) {
    return res.status(403).json({ message: "You can only manage requests sent to you" });
  }

  if (!["accept", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid follow request action" });
  }

  if (follow.status !== "pending") {
    return res.status(409).json({ message: `Follow request is already ${follow.status}` });
  }

  follow.status = action === "accept" ? "accepted" : "rejected";
  await follow.save();

  return res.status(200).json({
    message:
      action === "accept"
        ? "Request accepted. Posts are now visible for this connection."
        : "Request rejected.",
    follow,
  });
}

async function updateFollowRequestController(req, res) {
  const { requestId, action } = req.params;
  const follow = await followModel.findById(requestId);

  if (!follow) {
    return res.status(404).send("Follow request not found");
  }

  if (!["accept", "reject"].includes(action)) {
    return res.status(400).send("Invalid follow request action");
  }

  if (follow.status !== "pending") {
    return res.status(409).send(`Follow request is already ${follow.status}.`);
  }

  follow.status = action === "accept" ? "accepted" : "rejected";
  await follow.save();

  return res
    .status(200)
    .send(`Follow request ${follow.status}. Posts are now updated for this connection. You can close this page.`);
}

module.exports = {
  listUsersController,
  listFollowRequestsController,
  createFollowController,
  updateAuthenticatedFollowRequestController,
  updateFollowRequestController,
};

