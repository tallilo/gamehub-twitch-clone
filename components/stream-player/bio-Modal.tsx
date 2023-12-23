"use client";

import {
  Dialog,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Hint } from "../hint";
import { Textarea } from "../ui/textarea";
import { ElementRef, useRef, useState, useTransition } from "react";
import { UpdateUser } from "@/actions/user";
import { toast } from "sonner";

interface BioModalProps {
  initialValue: string | null;
}

export const BioModal = ({ initialValue }: BioModalProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(initialValue || "");
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      UpdateUser({ bio: value })
        .then(() => {
          toast.success(`bio updated successfully!`);
          closeRef.current?.click();
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto" variant="link" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user bio</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Textarea
            placeholder="User bio"
            onChange={(e) => setValue(e.target.value)}
            value={value}
            disabled={isPending}
            className="resize-none"
          />
          <div className="flex justify-between">
            <DialogClose asChild ref={closeRef}>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button variant="primary" disabled={isPending} type="submit">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
