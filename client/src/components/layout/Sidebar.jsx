import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Trash2, Plus, Presentation, LayoutGrid, Loader2, MessageSquare, LayoutDashboard, Folder, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import useHistoryStore from "@/store/useHistoryStore";
import CreditWallet from './CreditWallet';

const STALE_AFTER_MS = 30 * 1000;

const Sidebar = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const isActive = (path) => pathname === path;
    const history = useHistoryStore((state) => state.history);
    const loading = useHistoryStore((state) => state.loading);
    const error = useHistoryStore((state) => state.error);
    const lastFetched = useHistoryStore((state) => state.lastFetched);
    const fetchHistory = useHistoryStore((state) => state.fetchHistory);


    useEffect(() => {
        const isStale = !lastFetched || Date.now() - lastFetched > STALE_AFTER_MS;
        if (isStale) {
            fetchHistory(); 
        }
    }, []);
    
    const itemClass = (path) => cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors",
        isActive(path) 
        ? "bg-secondary text-secondary-foreground" 
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    );

    return (
        <div className="h-full w-full flex flex-col border-r border-border/50 bg-card/80 backdrop-blur-xl transition-colors duration-300">
            
            <div className="h-16 flex items-center px-4 border-b border-border/50 shrink-0">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-sm shadow-primary/20">
                        <Presentation size={18} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                        Morph<span className="text-primary">Deck</span>
                    </h1>
                </Link>
            </div>

            <div className="p-4 pb-2 shrink-0">
                <Link to="/">
                    <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-lg font-medium text-sm transition-all shadow-md shadow-primary/20 active:scale-95">
                        <Plus size={18} />
                        <span>New Presentation</span>
                    </button>
                </Link>
            </div>

            <nav className="px-3 mt-2 shrink-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-2">
                    Menu
                </div>
                <Link to="/library">
                    <div className={itemClass("/library")}>
                        <LayoutGrid size={18}/>
                        <span>My Library</span>
                    </div>
                </Link>

                <Link to="/trash">
                    <div className={itemClass("/trash")}>
                        <Trash2 size={18}/>
                        <span>Trash</span>
                    </div>
                </Link>
                
            </nav>

            <div className="flex-1 flex flex-col min-h-0 px-3 mt-4 overflow-hidden">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-2 shrink-0">
                    Recent
                </div>

                <div className="overflow-y-auto flex-1 -mx-2 px-2 no-scrollbar">
                    {loading && (
                        <div className="flex justify-center py-4 text-muted-foreground">
                            <Loader2 className="animate-spin" size={18} />
                        </div>
                    )}

                    {!loading && error && (
                        <div className="text-xs text-center py-4 text-red-400 italic px-2">
                        {error}
                        <button
                            onClick={fetchHistory}
                            className="block mx-auto mt-2 text-primary hover:underline"
                        >
                            Retry
                        </button>
                        </div>
                    )}

                    {!loading && !error && history.length === 0 && (
                        <div className="text-muted-foreground text-xs text-center py-4 italic">
                            No recent presentations.
                        </div>
                    )}

                    {!loading && !error && history.map((ppt) => (
                        <Link to={`/presentation/${ppt._id}`} key={ppt._id}>
                            <div className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer mb-1 truncate",
                                isActive(`/presentation/${ppt._id}`) 
                                ? "bg-secondary text-secondary-foreground" 
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}>
                                <MessageSquare size={16} className="shrink-0 opacity-70" />
                                <span className="truncate">{ppt.topic}</span>
                            </div>
                        </Link>
                    ))}

                </div>
            </div>
            <CreditWallet/>
        </div>
    )
}

export default Sidebar;