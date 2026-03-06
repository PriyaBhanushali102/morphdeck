import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatInput from "@/components/chat/ChatInput";
import MessageList from "@/components/chat/MessageList";
import SuggestionCard from "@/components/chat/SuggestionCard";
import { Lightbulb } from "lucide-react";
import { generatePPT } from "@/services/pptService";
import { SUGGESTIONS } from "@/config/editorConstants";
import toast from "react-hot-toast";
import useAuthStore from "@/store/useAuthStore";

const HomeChat = () => {
  const navigate  = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser)

  useEffect(() => { document.title = "MorphDeck - Create Presentation"; }, []);

  const handleSendMessage = async (text) => {
    if (user?.credits <= 0) {
      toast.error("You are out of credits! Please upgrade your plan.");
      return;
    }

    setMessages((prev) => [...prev, {
      role: "user",
      content: text
    }]);
    setLoading(true);

    try {
      const response = await generatePPT(text);

      if (!response.success) {
        toast.error("Failed to generate presentation");
        return;
      }

      const pptId = response.data?.pptId;
      if (!pptId) {
        toast.error("Presentation created but ID is missing. Please refresh.");
        return;
      }

      if (user) {
        updateUser({ credits: user.credits - 1 });
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "🎉 Presentation generated! Redirecting you to the editor...",
        },
      ]);
      toast.success("Presentation Created!");
      setTimeout(() => navigate(`/presentation/${pptId}`), 1500);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to generate presentation.";
      toast.error(errMsg);
      setMessages((prev) => [...prev, {
        role: "ai",
        content: `Error: ${errMsg}. Please check your credits.`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">

      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 no-scrollbar">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-3 text-center overflow-y-auto">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center p-1 m-4 text-blue-600 dark:text-blue-500 shadow-sm">
              <Lightbulb size={20} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">
              What shall we create today?
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-10 text-lg">
              Describe your topic, and I'll generate a professional PowerPoint presentation with structured content.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {SUGGESTIONS.map((item) => (
                <SuggestionCard
                  key={item.title} 
                  icon={item.icon}
                  title={item.title}
                  subtitle={item.sub}
                  onClick={() => handleSendMessage(`Create a ${item.title}`)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full">
            <MessageList messages={messages} loading={loading} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSendMessage} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default HomeChat;