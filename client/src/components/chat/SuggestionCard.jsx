import React from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowBigRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SuggestionCard = ({ icon: Icon, title, subtitle, onClick }) => {
    return (
        <Card
            onClick={onClick}
            onKeyDown={(e) => e.key === "Enter" && onClick()}
            tabIndex={0}                                      
            role="button" 
            className={cn(
                "group cursor-pointer transition-all duration-300 hover:-translate-y-1",
                "bg-white/60 hover:bg-white border-white/50 hover:shadow-xl hover:shadow-blue-900/5",
                "dark:bg-secondary/30 dark:hover:bg-secondary/50 dark:border-white/5"
            )}
        >
            <CardContent className="p-4 flex flex-col items-start gap-3">
                <div className="p-2.5 rounded-xl transition-colors bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={20} />
                </div>

                <div className="space-y-1 w-full">
                    <CardTitle className="font-semibold text-sm mb-1 text-foreground">
                        {title}
                    </CardTitle>
                    
                    <div className="flex items-center justify-between">
                        <CardDescription className="text-xs line-clamp-2 leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
                            {subtitle}
                        </CardDescription>
                        
                        <ArrowBigRight 
                            size={16} 
                            className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500 dark:text-blue-400"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default SuggestionCard;