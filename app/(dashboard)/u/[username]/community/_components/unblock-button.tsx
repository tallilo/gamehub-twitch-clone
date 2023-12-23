"use client";

import { onUnblock } from "@/actions/block";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";

interface UnblockButtonProps {
  userId: string;
}

export const UnblockedButton = ({ userId }: UnblockButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const onSubmit = () => {
    startTransition(() => {
      onUnblock(userId)
        .then((result) => {
          toast.success(`User  ${result.blocked.username} unblocked`);
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  };

  return (
    <Button
      variant="link"
      size="sm"
      className="text-blue-500 w-full"
      disabled={isPending}
      onClick={onSubmit}
    >
      Unblocked
    </Button>
  );
};
