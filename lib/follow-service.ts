import { db } from "./db";
import { getSelf } from "./auth-service";

export const getFollowedUsers = async () => {
  try {
    const self = await getSelf();

    const followedUsers = db.follow.findMany({
      where: {
        followerId: self.id,
        following: {
          blocking: {
            none: {
              blockedId: self.id,
            },
          },
        },
      },
      include: {
        following: {
          include: {
            stream: {
              select: {
                isLive: true,
              },
            },
          },
        },
      },
    });

    return followedUsers;
  } catch (error) {
    return [];
  }
};

export const isFollowingUser = async (id: string) => {
  try {
    const self = await getSelf();

    const otherUser = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!otherUser) {
      throw new Error("User not found");
    }

    if (otherUser.id === self.id) {
      return true;
    }
    /// follower = who that follow the following user
    const existingFollow = await db.follow.findFirst({
      where: {
        followerId: self.id,
        followingId: otherUser.id,
      },
    });

    return !!existingFollow;
  } catch (error) {
    return false;
  }
};

export const followUser = async (id: string) => {
  const self = await getSelf();

  const otherUser = await db.user.findUnique({
    where: {
      id,
    },
  });
  if (!otherUser) {
    throw new Error("user not Found");
  }
  if (otherUser.id === self.id) {
    throw new Error("cannot follow urself");
  }

  const existingFollow = await db.follow.findFirst({
    where: {
      followerId: self.id,
      followingId: otherUser.id,
    },
  });

  if (existingFollow) {
    throw new Error("Already following");
  }

  const follow = await db.follow.create({
    data: {
      followerId: self.id,
      followingId: otherUser.id,
    },
    include: {
      following: true,
      follower: true,
    },
  });

  return follow;
};

export const unfollowerUser = async (id: string) => {
  const self = await getSelf();

  const otherUser = await db.user.findUnique({ where: { id } });

  if (!otherUser) {
    throw new Error("the user dosent exist");
  }
  if (otherUser.id === self.id) {
    throw new Error("you cant unfollowed yourself");
  }

  const existingFollow = await db.follow.findFirst({
    where: {
      followerId: self.id,
      followingId: otherUser.id,
    },
  });
  if (!existingFollow) {
    throw new Error(
      "the user is not followed by you in the first place, so you cant unfollowed"
    );
  }

  const deletedFollow = await db.follow.delete({
    where: {
      id: existingFollow.id,
    },
    include: {
      following: true,
    },
  });

  return deletedFollow;
};
