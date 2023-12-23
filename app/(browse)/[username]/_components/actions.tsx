"use client";

import { onBlock, onUnblock } from "@/actions/block";
import { onFollow, onUnfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";

interface ActionsProps {
  isFollowing: boolean;
  userId: string;
}

export const Actions = ({ isFollowing, userId }: ActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const handleFollow = () => {
    startTransition(() => {
      onFollow(userId)
        .then((data) => {
          toast.success(`you are now following: ${data.following.username}`);
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  };

  const handleUnFollow = () => {
    startTransition(() => {
      onUnfollow(userId)
        .then((data) => {
          toast.success(
            `you have unfollowed the user: ${data.following.username}`
          );
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  };

  const onClick = () => {
    if (isFollowing) {
      return handleUnFollow();
    }
    handleFollow();
  };
  const handleBlock = () => {
    startTransition(() => {
      onBlock(userId)
        .then((data) =>
          toast.success(`Blocked the user ${data?.blocked.username}`)
        )
        .catch(() => toast.error("something went wrong"));
    });
  };
  return (
    <>
      <Button disabled={isPending} onClick={onClick} variant="primary">
        {isFollowing ? "Unfollow" : "follow"}
      </Button>
      <Button onClick={handleBlock} disabled={isPending}>
        Block User
      </Button>
    </>
  );
};
