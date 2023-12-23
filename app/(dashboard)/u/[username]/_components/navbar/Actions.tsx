import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, currentUser } from "@clerk/nextjs";
import { Clapperboard, LogOut } from "lucide-react";
import Link from "next/link";

export default function Actions() {
  return (
    <div className="flex items-center justify-end  gap-x-2">
      <Button
        asChild
        size="sm"
        variant="ghost"
        className="hover:text-primary text-muted-foreground"
      >
        <Link href="/">
          <LogOut className="h-5 w-5 mr-2" />
          Exit
        </Link>
      </Button>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
