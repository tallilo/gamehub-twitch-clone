"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ElementRef, useRef, useState, useTransition } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { updateStream } from "@/actions/strem";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Hint } from "../hint";
import { Trash } from "lucide-react";
import Image from "next/image";

interface InfoModalProps {
  initialName: string;
  initialThumbnailUrl: string | null;
}

export const InfoModal = ({
  initialName,
  initialThumbnailUrl,
}: InfoModalProps) => {
  const [name, setName] = useState(initialName);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnailUrl);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const closeRef = useRef<ElementRef<"button">>(null);

  const onRemove = () => {
    startTransition(() => {
      updateStream({ thumbnailUrl: null })
        .then((data) => {
          toast.success(`Thumbnail removed`);
          setThumbnailUrl("");
          closeRef.current?.click();
        })
        .catch(() => toast.error("something went wrong"));
    });
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      updateStream({ name })
        .then((data) => {
          toast.success(`Strem updated`);
          closeRef.current?.click();
        })
        .catch(() => toast.error("something went wrong"));
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
          <DialogTitle>Edit stream info</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-14">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              disabled={isPending}
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              placeholder="Stream name"
            />
          </div>
          <div className="space-y-2 ">
            <Label>Thumbnail</Label>
            {thumbnailUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 ">
                <div className="absolute top-2 right-2 z-[10]">
                  <Hint label="remove thumbnail" asChild side="left">
                    <Button
                      type="button"
                      disabled={isPending}
                      onClick={onRemove}
                      className="h-auto w-auto p-1.5"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </Hint>
                </div>
                <Image
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="rounded-xl border outline-dashed outline-muted">
                <UploadDropzone
                  endpoint="thumbnailUrlUploader"
                  appearance={{
                    label: {
                      color: "#FFFFFF",
                    },
                    allowedContent: {
                      color: "#FFFFFF",
                    },
                  }}
                  onClientUploadComplete={(res) => {
                    setThumbnailUrl(res?.[0]?.url);
                    router.refresh();
                    closeRef.current?.click();
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex justify-between">
            <DialogClose ref={closeRef} asChild>
              <Button variant="ghost" type="button">
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
