import React from "react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import UserNav from "@/components/layout/UserNav";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-md pl-2 pr-4 transition-all duration-300">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <ModeToggle />
        <UserNav />
      </div>
    </header>
  );
};

export default Navbar;