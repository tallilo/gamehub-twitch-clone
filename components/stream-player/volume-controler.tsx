"use client";

import { Volume1, Volume2, VolumeX } from "lucide-react";
import { Hint } from "../hint";
import { Slider } from "../ui/slider";

interface VolumControlProps {
  onToggle: () => void;
  onChange: (value: number) => void;
  value: number;
}

export const VolumControl = ({
  onToggle,
  onChange,
  value,
}: VolumControlProps) => {
  const isMuted = value === 0;
  const isAboveHalf = value > 50;

  let Icon = Volume1;
  if (isMuted) {
    Icon = VolumeX;
  }
  if (isAboveHalf) {
    Icon = Volume2;
  }

  const label = isMuted ? "Unmute" : "Mute";

  const handleChange = (value: number[]) => {
    onChange(value[0]);
  };

  return (
    <div className="flex items-center gap-2">
      <Hint label={label} asChild>
        <button
          className=" rounded-lg p-1.5 text-white hover:bg-white/10"
          onClick={onToggle}
        >
          <Icon className="h-6 w-6" />
        </button>
      </Hint>
      <Slider
        value={[value]}
        onValueChange={handleChange}
        className="w-[8rem] cursor-pointer"
        max={100}
        step={1}
      />
    </div>
  );
};
