import { db } from "./db";
import { getSelf } from "./auth-service";

export const isBlockedByUser = async (id: string) => {
  try {
    const self = await getSelf();

    const otherUser = await db.user.findUnique({
      where: { id },
    });
    if (!otherUser) {
      throw new Error("User not found");
    }
    if (otherUser.id === self.id) {
      return false;
    }
    const existingBlock = await db.block.findFirst({
      where: {
        blockedId: self.id,
        blockerId: otherUser.id,
      },
    });
    return !!existingBlock;
  } catch (error) {
    return false;
  }
};

export const blockUser = async (id: string) => {
  const self = await getSelf();

  if (self.id === id) {
    throw new Error("Cant block yourself!");
  }

  const otherUser = await db.user.findUnique({
    where: {
      id,
    },
  });
  if (!otherUser) {
    throw new Error("User not Found");
  }
  /// check if we already blocked this user

  const existingBlock = await db.block.findFirst({
    where: {
      blockedId: otherUser.id,
      blockerId: self.id,
    },
  });
  if (existingBlock) {
    throw new Error("the user already blocked!");
  }

  const newBlock = await db.block.create({
    data: {
      blockedId: otherUser.id,
      blockerId: self.id,
    },
    include: {
      blocked: true,
    },
  });
  return newBlock;
};

export const unblockUser = async (id: string) => {
  try {
    const self = await getSelf();

    if (id === self.id) {
      throw new Error("cant unblock yourself");
    }

    const otherUser = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!otherUser) {
      throw new Error("the user not found");
    }
    //// check for the block relation

    const existingBlock = await db.block.findFirst({
      where: {
        blockedId: otherUser.id,
        blockerId: self.id,
      },
    });
    if (!existingBlock) {
      throw new Error("the user was unblocked in the first place");
    }
    const unblocked = await db.block.delete({
      where: {
        id: existingBlock.id,
      },
      include: {
        blocked: true,
      },
    });

    return unblocked;
  } catch (error) {
    throw new Error(`Internal server error : ${error} `);
  }
};

export const getBlockedUsers = async () => {
  const self = await getSelf();

  const blockedUsers = await db.block.findMany({
    where: {
      blockerId: self.id,
    },
    include: {
      blocked: true,
    },
  });
  return blockedUsers;
};
