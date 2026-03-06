import React, { useState, useEffect} from "react";
import { getDeletedPPTs, restorePPT, permanentDeletePPT } from "@/services/pptService";
import { Loader2, Trash2, RefreshCw, AlertTriangle } from "lucide-react";
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

const Trash = () => {
    const [deletedPPTs, setDeletedPPTs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    useEffect(() => { document.title = "Trash - MorphDeck"; }, []);
    
    const fetchTrash = async () => {
        setLoading(true);
        try {
            const data = await getDeletedPPTs();
            setDeletedPPTs(data);
        } catch{
            toast.error("Failed to fetch deleted PPTs");
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchTrash();
    }, []);

    const handleRestore = async (id) => {
        try {
            await restorePPT(id);
            setDeletedPPTs((prev) => prev.filter(ppt => ppt._id !== id));
            toast.success("Presentation restored");
        } catch {
            toast.error("Failed to restore presentation");
        }
    }

    const handlePermanentDelete = async () => {
        if (!deleteTargetId) return;
        try {
            setDeleting(true);
            await permanentDeletePPT(deleteTargetId);
            setDeleting(false);
            setDeletedPPTs((prev) => prev.filter(ppt => ppt._id !== deleteTargetId));
            toast.success("Permanently Deleted");
        } catch {
            toast.error("Failed to permanently delete presentation");
        } finally {
            setDeleteTargetId(null);
        }
    }

    return (
        <div className="p-8 h-full bg-background overflow-y-auto">
            <h1 className="text-3xl font-bold mb-2">My Trash</h1>
            <p className="text-muted-foreground mb-8">Deleted presentations. Restore them or delete forever.</p>

            {loading ? (
                <div className="flex justify-center mt-10">
                    <Loader2 className="animate-spin" />
                </div>
            ) : (
                    deletedPPTs.length === 0 ? (
                        <div className="text-center mt-20 text-muted-foreground">
                            Trash is empty.
                        </div>
                    ) : (
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
                                {deletedPPTs.map((ppt) => (
                                    <Card key={ppt._id} className="border-destructive/20 opacity-80 hover:opacity-100 transition-opacity">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg line-clamp-1">{ppt.topic}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pb-2">
                                            <p className="text-xs text-muted-foreground">{ppt.slideCount} slides</p>
                                        </CardContent>
                                        <CardFooter className="flex justify-end gap-2 pt-2">
                                            <Button variant="outline" size="sm" onClick={() => handleRestore(ppt._id)}>
                                                <RefreshCw size={14} className="mr-2"/> Restore
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => setDeleteTargetId(ppt._id)}>
                                                Delete Forever
                                            </Button>
                                        </CardFooter>
                                    </Card>                         
                                ))}
                            </div>
                ))}
            
            <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle size={18} /> Permanently Delete?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action <strong>cannot be undone</strong>. This presentation and all its slides
              will be permanently deleted from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePermanentDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
            >
              Yes, Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        </div>
    )
}


export default Trash;






