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

async function listUsersController(req, res) {
  const currentUser = await userModel.findById(req.user.id);
  const users = await userModel
    .find({ _id: { $ne: req.user.id } })
    .select("username profileImage bio")
    .lean();

  const follows = await followModel
    .find({ follower: req.user.id })
    .select("followee status")
    .lean();

  const followByUserId = new Map(
    follows.map((follow) => [follow.followee.toString(), follow.status]),
  );

  res.status(200).json({
    currentUser: getPublicUser(currentUser),
    users: users.map((user) => ({
      ...user,
      followStatus: followByUserId.get(user._id.toString()) || "none",
    })),
  });
}

async function listFollowRequestsController(req, res) {
  const [incoming, outgoing] = await Promise.all([
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
  ]);

  res.status(200).json({
    incoming: incoming.map((request) => ({
      id: request._id,
      status: request.status,
      createdAt: request.createdAt,
      user: request.follower,
    })),
    outgoing: outgoing.map((request) => ({
      id: request._id,
      status: request.status,
      createdAt: request.createdAt,
      user: request.followee,
    })),
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

  try {
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

    const apiBaseUrl =
      env.apiPublicUrl || `${req.protocol}://${req.get("host")}`;
    const acceptUrl = `${apiBaseUrl}/api/user/follows/${follow._id}/accept`;
    const rejectUrl = `${apiBaseUrl}/api/user/follows/${follow._id}/reject`;

    await sendFollowRequestEmail({
      to: targetUser.email,
      targetUsername: targetUser.username,
      requesterUsername: currentUser.username,
      acceptUrl,
      rejectUrl,
    });

    return res.status(201).json({
      message: "Follow request sent",
      follow,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not send follow request" });
  }
}

async function updateAuthenticatedFollowRequestController(req, res) {
  try {
    const { requestId, action } = req.params;
    const follow = await followModel.findById(requestId);

    if (!follow) {
      return res.status(404).json({ message: "Follow request not found" });
    }

    if (follow.followee.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You can only manage requests sent to you" });
    }

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid follow request action" });
    }

    follow.status = action === "accept" ? "accepted" : "rejected";
    await follow.save();

    return res.status(200).json({
      message: `Follow request ${follow.status}`,
      follow,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not update follow request" });
  }
}

async function updateFollowRequestController(req, res) {
  try {
    const { requestId, action } = req.params;
    const follow = await followModel.findById(requestId);

    if (!follow) {
      return res.status(404).send("Follow request not found");
    }

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).send("Invalid follow request action");
    }

    follow.status = action === "accept" ? "accepted" : "rejected";
    await follow.save();

    return res
      .status(200)
      .send(`Follow request ${follow.status}. You can close this page.`);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Could not update follow request");
  }
}

module.exports = {
  listUsersController,
  listFollowRequestsController,
  createFollowController,
  updateAuthenticatedFollowRequestController,
  updateFollowRequestController,
};

