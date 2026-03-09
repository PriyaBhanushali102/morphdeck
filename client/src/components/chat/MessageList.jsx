import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

const MessageList = ({ messages, loading }) => {
  const bottomRef = useRef(null); 

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages, loading]);

  return (
    <ScrollArea className="flex-1 h-full px-4">
      <div className="max-w-3xl mx-auto py-6 space-y-8">

        {messages.map((msg, index) => (
          <div
            key={msg._id || `${msg.role}-${index}`}
            className={cn("flex gap-4", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            {msg.role === "ai" && (
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot size={16} />
                </AvatarFallback>
              </Avatar>
            )}

            <div className={cn(
              "relative px-5 py-3.5 text-sm md:text-base leading-relaxed max-w-[85%] shadow-sm",
              msg.role === "user"
                ? "rounded-2xl rounded-tr-sm bg-secondary text-secondary-foreground"
                : "bg-transparent text-foreground"
            )}>
              {msg.content}
            </div>

            {msg.role === "user" && (
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-4">
            <Avatar className="h-8 w-8 border border-border animate-pulse">
              <AvatarFallback className="bg-primary/20"><Bot size={16} /></AvatarFallback>
            </Avatar>
            <div className="space-y-2 mt-2">
              <div className="h-2 w-24 bg-muted rounded-full animate-pulse" />
              <div className="h-2 w-16 bg-muted rounded-full animate-pulse" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;