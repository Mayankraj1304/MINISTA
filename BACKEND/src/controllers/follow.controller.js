const userModel = require("../models/User.model");
const followModel = require("../models/follow.model");

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
    follower: currentUser.username,
    followee: targetUsername,
  });

  if (existingFollow) {
    return res
      .status(409)
      .json({ message: "You are already following this user" });
  }

  try {
    const follow = await followModel.create({
      follower: currentUser.username,
      followee: targetUsername,
    });

    return res.status(201).json({
      message: "Follow created",
      follow,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createFollowController,
};
