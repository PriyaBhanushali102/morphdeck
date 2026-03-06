import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ChatInput = ({ onSend, loading }) => {
  const [text, setText] = useState("");
  const textareaRef     = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    onSend(text.trim()); 
    setText("");         
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="relative bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all shadow-lg shadow-black/5"
      >
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your presentation topic..."
          className="min-h-[60px] max-h-[180px] w-full resize-none border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 py-4 pl-4 pr-14 no-scrollbar shadow-none text-base"
        />
        <div className="absolute bottom-2 right-2">
          <Button
            type="submit"
            size="icon"
            disabled={!text.trim() || loading}
            className={`h-9 w-9 rounded-xl transition-all ${
              text.trim()
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {loading
              ? <Sparkles className="animate-spin" size={20} />
              : <Send size={20} className={text.trim() ? "ml-0.5" : ""} />
            }
          </Button>
        </div>
      </form>
      <p className="text-center text-[10px] text-muted-foreground mt-3 font-medium opacity-70">
        AI Generated content can be inaccurate.
      </p>
    </div>
  );
};

export default ChatInput;