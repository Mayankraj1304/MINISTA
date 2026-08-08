const followModel = require("../models/follow.model");

async function getVisibleUserIds(userId) {
  const acceptedConnections = await followModel
    .find({
      status: "accepted",
      $or: [{ follower: userId }, { followee: userId }],
    })
    .select("follower followee")
    .lean();

  const visibleUserIds = new Set([userId.toString()]);

  acceptedConnections.forEach((connection) => {
    const followerId = connection.follower.toString();
    const followeeId = connection.followee.toString();
    visibleUserIds.add(followerId === userId.toString() ? followeeId : followerId);
  });

  return Array.from(visibleUserIds);
}

async function canUserViewPost(userId, post) {
  const postOwnerId = post.user.toString();

  if (postOwnerId === userId.toString()) {
    return true;
  }

  return Boolean(
    await followModel.exists({
      status: "accepted",
      $or: [
        { follower: userId, followee: post.user },
        { follower: post.user, followee: userId },
      ],
    }),
  );
}

module.exports = {
  canUserViewPost,
  getVisibleUserIds,
};
