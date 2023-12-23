"use client";

import { useDebounce } from "usehooks-ts";
import { useParticipants } from "@livekit/components-react";
import { useMemo, useState } from "react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { CommunityItem } from "./community-item";
import { LocalParticipant, RemoteParticipant } from "livekit-client";

interface ChatCommunityProps {
  isHidden: boolean;
  hostName: string;
  viewerName: string;
}

export const ChatCommunity = ({
  isHidden,
  viewerName,
  hostName,
}: ChatCommunityProps) => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce<string>(value, 500);
  const participants = useParticipants();
  const onChange = (newValue: string) => {
    setValue(newValue);
  };
  const filteredParticipant = useMemo(() => {
    const deduped = participants.reduce((acc, cur) => {
      const hoastAsViewer = `host-${cur.identity}`;
      if (!acc.some((p) => p.identity === hoastAsViewer)) {
        acc.push(cur);
      }
      return acc;
    }, [] as (RemoteParticipant | LocalParticipant)[]);

    return deduped.filter((p) => {
      return p.name?.toLowerCase().includes(debouncedValue.toLowerCase());
    });
  }, [participants, debouncedValue]);

  if (isHidden) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Community is disabled</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Input
        className="border-white/10"
        placeholder="Search community"
        onChange={(e) => setValue(e.target.value)}
      />
      <ScrollArea className="gap-y-2 mt-4">
        <p className="text-center text-sm text-muted-foreground hidden last:block p-2">
          No results
        </p>
        {filteredParticipant.map((participant) => (
          <CommunityItem
            key={participant.identity}
            hostName={hostName}
            viewerName={viewerName}
            participantName={participant.name}
            participantIdentity={participant.identity}
          />
        ))}
      </ScrollArea>
    </div>
  );
};
