"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { ChatInfo } from "./chat-info";

interface ChatFormProps {
  onSubmit: () => void;
  value: string;
  onChange: (value: string) => void;
  isHidden: boolean;
  isFollowersOnly: boolean;
  isFollowing: boolean;
  isDelayed: boolean;
}

export const ChatForm = ({
  onChange,
  isHidden,
  isFollowersOnly,
  isFollowing,
  isDelayed,
  value,
  onSubmit,
}: ChatFormProps) => {
  const [isDelayedBlock, setIsDelayedBlock] = useState(false);

  const isFollowersOnlyAndNotFollowing = isFollowersOnly && !isFollowing;
  const isDisabled =
    isHidden || isDelayedBlock || isFollowersOnlyAndNotFollowing;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(1);
    if (!value || isDisabled) return;
    console.log(2);
    if (!isDelayed && !isDelayedBlock) {
      setIsDelayedBlock(true);
      setTimeout(() => {
        setIsDelayedBlock(false);
        onSubmit();
        console.log(3);
      }, 3000);
    } else {
      onSubmit();
      console.log(4);
    }
  };
  if (isHidden) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-y-2 p-3"
    >
      <div className="w-full">
        <ChatInfo isDelayed={isDelayed} isFollowersOnly={isFollowersOnly} />
        <Input
          disabled={isDisabled}
          placeholder="send a message"
          className={cn(
            "border-white/10",
            (isFollowersOnly || isDelayed) && "rounded-t-none border-t-0"
          )}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
      </div>
      <div className="self-end">
        <Button type="submit" variant="primary" size="sm" disabled={isDisabled}>
          Chat
        </Button>
      </div>
    </form>
  );
};

export const ChatFormSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-y-4 p-3">
      <Skeleton className="w-full h-10" />
      <div className="flex items-center gap-x-2 ml-auto">
        <Skeleton className="h-7 w-7" />
        <Skeleton className="h-7 w-12" />
      </div>
    </div>
  );
};
