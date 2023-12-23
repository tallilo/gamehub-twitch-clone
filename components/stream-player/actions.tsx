"use client";

import { useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { onFollow, onUnfollow } from "@/actions/follow";
import { useTransition } from "react";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

interface ActionsProps {
  isFollowing: boolean;
  isHost: boolean;
  hostIdentity: string;
}

export const Actions = ({
  isFollowing,
  isHost,
  hostIdentity,
}: ActionsProps) => {
  const { userId } = useAuth();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const toggleFollow = () => {
    if (!userId) return router.push("/sign-in");

    if (isHost) return;

    if (!isFollowing) {
      //Unfollow
      startTransition(() => {
        onFollow(hostIdentity)
          .then((data) => {
            toast.success(`Follow ${data.following.username}`);
          })
          .catch(() => {
            toast.error("Something went wrong");
          });
      });
    } else {
      //Follow
      startTransition(() => {
        onUnfollow(hostIdentity)
          .then((data) => {
            toast.success(`Unfollow ${data.following.username}`);
          })
          .catch(() => {
            toast.error("Something went wrong");
          });
      });
    }
  };

  return (
    <Button
      disabled={isPending || isHost}
      size="sm"
      className="w-full lg:w-auto"
      variant="primary"
      onClick={toggleFollow}
    >
      <Heart
        className={cn("h-4 w-4 mr-2", isFollowing ? "fill white" : "fill-none")}
      />
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export const ActionsSkeleton = () => {
  return <Skeleton className=" h-10 w-full lg:w-24" />;
};
