import React, {useState, useEffect } from "react";
import { softDeletePPT } from "@/services/pptService";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Loader2, Trash2, FileText, Calendar, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useHistoryStore from "@/store/useHistoryStore";

const Library = () => {
  const { history: ppts, loading, fetchHistory, removeFromHistory } = useHistoryStore();

  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    document.title = "My Library - MorphDeck"; 
      fetchHistory();
  }, []);
  
  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await softDeletePPT(deleteTargetId);
      removeFromHistory(deleteTargetId);
      toast.success("Moved to Trash");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-background">
      <h1 className="text-3xl font-bold mb-2">My Library</h1>
      <p className="text-muted-foreground mb-8">Your collection of AI-generated presentations.</p>

      {loading ? (
        <div className="flex justify-center mt-20">
          <Loader2 className="animate-spin text-primary" />
        </div>
      ) : ppts.length === 0 ? (
        <div className="text-center mt-20 text-muted-foreground">
          <p>You haven't created any presentations yet.</p>
          <Link to="/home"><Button className="mt-4">Create New</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
          {ppts.map((ppt) => (
            <Link to={`/presentation/${ppt._id}`} key={ppt._id}>
              <Card className="hover:shadow-lg transition-all border-border/50 group cursor-pointer h-full flex flex-col">
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 h-32 flex items-center justify-center">
                  <FileText size={40} className="text-primary/60 group-hover:scale-110 transition-transform" /> {/* ✅ typo fixed */}
                </CardHeader>
                <CardContent className="p-4 flex-1">
                  <CardTitle className="line-clamp-2 text-lg mb-2 group-hover:text-primary transition-colors">
                    {ppt.topic}
                  </CardTitle>
                  <div className="flex items-center text-xs text-muted-foreground gap-2">
                    <Calendar size={12} />
                    {format(new Date(ppt.createdAt), "MMM dd, yyyy")}
                    <span>•</span>
                    <span>{ppt.slideCount} Slides</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteTargetId(ppt._id)
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" /> Move to Trash?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This presentation will be moved to the Trash. You can restore it later from the Trash page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Move to Trash
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default Library;