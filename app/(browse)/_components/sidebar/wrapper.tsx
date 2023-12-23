"use client";
import { useSidebar } from "@/store/use-sidebar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ToggleSkeleton } from "./Toggle";
import { RecommendedSkeleton } from "./recommended";
import { SidebarSkeleton } from ".";
interface WrapperProps {
  children: React.ReactNode;
}

export const Wrapper = ({ children }: WrapperProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const { collapsed } = useSidebar();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <SidebarSkeleton />;
  }

  return (
    <aside
      className={cn(
        "fixed left-0 flex flex-col w-60 h-full bg-background border-r border-[#2D2E35] z-50",
        collapsed && "w-[70px]"
      )}
    >
      {children}
    </aside>
  );
};
