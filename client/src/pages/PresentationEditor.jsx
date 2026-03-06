import React, { useEffect, useState , useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getPPTById, getPublicPPTById, updatePPT, exportPPT } from "@/services/pptService";
import { Loader2, X} from "lucide-react";
import toast from "react-hot-toast";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import EditorToolbar from "@/components/editor/EditToolbar.jsx";
import SlideCarousel from "@/components/editor/SlideCarousel.jsx";
import SortableList from "@/components/editor/SortableList";
import { ScrollArea } from "@/components/ui/scroll-area";
import SlideCard from "@/components/editor/SlideCard";
import { uploadImage } from "@/services/uploadService";
import useSlideManager from "@/hooks/useSlideManager";
import useUndoRedo from "@/hooks/useUndoRedo";

const PresentationEditor = () => {
  const { id } = useParams();
  const location = useLocation();
  const saveTimerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const { state: ppt, set: setPpt, undo, redo } = useUndoRedo(null);
  const { addSlide, deleteSlide } = useSlideManager(ppt, setPpt, activeIndex, setActiveIndex);
  const isViewMode = location.pathname.includes("/view");
  console.log("pathname:", location.pathname, "isViewMode:", isViewMode); // ← add

  
  useEffect(() => {
    if (ppt?.topic) {
      document.title = `${ppt.topic} - MorphDeck`;
    }
  }, [ppt?.topic]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target.tagName === 'INPUT' || 
        e.target.tagName === 'TEXTAREA' || 
        e.target.isContentEditable || 
        (e.target.closest && e.target.closest('.ProseMirror')) 
      ) {
        return; 
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          e.shiftKey ? redo() : undo();
        } else if (e.key.toLowerCase() === 'y') {
          e.preventDefault();
          redo();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);
  
  useEffect(() => {
    const fetchPPT = async () => {
      if (!id || id === "undefined") {
        setLoading(false);
        return;
      }
      try {
        const response =isViewMode ? await getPublicPPTById(id): await getPPTById(id);
        if (response.success) {
          const cleanSlides = response.data.slides.map((s, i) => ({
            ...s, _id: s._id || `temp-${i}-${Date.now()}`
          }))
          setPpt({ ...response.data, slides: cleanSlides, templateId: response.data.templateId || "modern_blue", customTheme: response.data.customTheme || null });
        } else {
          toast.error("Failed to load presentation.");
        }
      } catch {
        toast.error("Error loading presentation.");
      } finally {
        setLoading(false);
      }
    };
    fetchPPT();
  }, [id, setPpt, isViewMode]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setIsPresenting(false);
      } 
    }
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    }
  }, []);

  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';  
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleThemeChange = (themeData) => {
    setIsDirty(true);
    if (typeof themeData === 'object' && themeData !== null) {
      setPpt(prev => ({
        ...prev,
        templateId: "custom",
        customTheme: themeData
      }));
      updatePPT(id, { templateId: "custom", customTheme: themeData }).catch(() => toast.error("Failed to save theme"));
      toast.success("Custom Theme Applied!");
    } else {
      setPpt(prev => ({ ...prev, templateId: themeData }));
      updatePPT(id, { templateId: themeData }).catch(() => toast.error("Failed to save theme"));
    }
  }

  const handleSlideUpdate = (index, field, value, bulletIndex = null) => {
    setIsDirty(true);
    setPpt((prev) => {
      const newSlides = [...prev.slides];
      
      const slide = { ...newSlides[index] };

      if (field === "title") {
        slide.title = value;
      } else if (field === "content" && bulletIndex !== null && bulletIndex !== undefined) {
        const content = [...slide.content];
        content[bulletIndex] = value;
        slide.content = content;
      } else if (field === "content" && Array.isArray(value)) {
        slide.content = value;
      } else if (field === "speakerNotes") {
        slide.speakerNotes = value;
      } else if (field === "images") {
        slide.images = value;
      }
      newSlides[index] = slide;
      return { ...prev, slides: newSlides };
    });
  };

  const handleReorder = (newSlides) => {
    setIsDirty(true);
    setPpt((prev) => ({ ...prev, slides: newSlides }));
    
    clearTimeout(saveTimerRef.current); 
    saveTimerRef.current = setTimeout(() => {
      updatePPT(id, { slides: newSlides }).catch(() => toast.error("Failed to save order"));
    }, 1000);
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const cleanSlides = ppt.slides.map(slide => {
        const { _id, ...rest } = slide;
        return String(_id).includes("-") ? rest : slide;
      })
      
      const payload = {
        slides: cleanSlides,
        templateId: ppt.templateId,
        customTheme: ppt.customTheme 
      };
      
      const result = await updatePPT(id, payload);
      if (result) {
        toast.success("Saved to Database!");
        setIsDirty(false);
      }
    } catch  {
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };
    
  const handleDownload = async () => {
    const safeTitle = ppt?.topic || ppt?.title || "Untitled Presentation";
    toast.promise(
      exportPPT(id, safeTitle),
      {
        loading: 'Generating PowerPoint...',
        success: 'Downloaded!',
        error: (err) => `Export Failed: ${err.message || "Unknown error"}`
      }
    )
  }

  const handleExportPDF = async () => {
    setIsExportingPdf(true);

    await new Promise((r) => setTimeout(r, 200));

    const toastId = toast.loading("Generating High-Res PDF... This might take a few seconds.");

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1280, 720]
      });

      for (let i = 0; i < ppt.slides.length; i++) {
        const slideElement = document.getElementById(`pdf-slide-${i}`);
        if (!slideElement) continue;

        const canvas = await html2canvas(slideElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          width: 1280,       
          height: 720,        
          windowWidth: 1280,
          windowHeight: 720,  
          onclone: (clonedDoc) => {
            const el = clonedDoc.getElementById(`pdf-slide-${i}`);
            if (el) {
              el.style.transform = 'none';
              el.style.display = 'block';
            }
          }
        });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, 1280, 720);
      }

      const safeTitle = ppt?.topic || ppt?.title || "Presentation";
      pdf.save(`${safeTitle.replace(/\s+/g, "_")}.pdf`);
      
      toast.success("PDF Downloaded successfully!", { id: toastId });
    } catch  {
      toast.error("Failed to generate PDF.", { id: toastId });
    } finally {
      setIsExportingPdf(false);
    }
  }

  const handleShare = () => {
     const viewUrl = `${window.location.origin}/view/${id}`;
    navigator.clipboard.writeText(viewUrl);
    toast.success("Link copied to clipboard!");
  };

  const handlePresent = () => {
    setIsPresenting(true);
    document.documentElement.requestFullscreen?.();
    toast("Press ESC to exit", { icon: "📺" });
  };

  const exitPresent = () => {
    setIsPresenting(false);                                    
    if (document.fullscreenElement) document.exitFullscreen();
  };

  const handleImageUpload = async (file) => {
    if (!file) return
    const formData = new FormData();
    formData.append("image", file);

    const loadingToast = toast.loading("Uploading image...");

    try {
      
      const data = await uploadImage(formData);

      if (data.success) {
        setIsDirty(true);
        setPpt((prev) => {
          const newSlides = [...prev.slides];
          const currentSlide = newSlides[activeIndex];  
          const updatedImages = [...(currentSlide.images || []), { 
            url: data.url, x: "30%", y: "20%", w: "300px", h: "200px", rotate: 0,
          }];
          newSlides[activeIndex] = { ...currentSlide, images: updatedImages };
            
          return { ...prev, slides: newSlides };
        });
        toast.success("Image added!", { id: loadingToast});
      } else {
        toast.error("Upload failed: " + data.message, { id: loadingToast });
      }
    } catch {
      toast.error("Upload error", { id: loadingToast });
    }
  }

  const handleLayoutChange = (newLayout) => {
    setIsDirty(true);
    setPpt((prev) => {
      const newSlides = [...prev.slides];
      newSlides[activeIndex] = { ...newSlides[activeIndex], layout: newLayout };
      return { ...prev, slides: newSlides };
    })
  }
  
  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;
  if (!ppt) return <div className="h-screen flex items-center justify-center">Presentation not found</div>;

  if (isPresenting || isViewMode) {
    return (
        <div className="fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center">       
        {!isViewMode && (
          <div className="absolute top-4 right-6 z-50 opacity-0 hover:opacity-100 transition-opacity">
            <button onClick={exitPresent} className="bg-white/20 p-2 rounded-full text-white">
              <X size={24} />
            </button>
          </div>
        )}

          <div className="absolute inset-y-0 left-0 w-1/5 z-40 cursor-pointer" onClick={() => setActiveIndex(p => Math.max(0, p - 1))} title="Previous" />
          <div className="absolute inset-y-0 right-0 w-1/5 z-40 cursor-pointer" onClick={() => setActiveIndex(p => Math.min(ppt.slides.length - 1, p + 1))} title="Next" />
      
          <div className="w-full h-full">
                    <SlideCarousel 
                        slides={ppt.slides}
                        activeIndex={activeIndex}
                        onSlideChange={(index) => setActiveIndex(index)}
                        onUpdateSlide={() => { }} 
                        viewMode="present"
                        activeTheme={ppt.templateId || "modern_blue"}
                        customThemeData={ppt.customTheme}
                    />
                 
          </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <div className="shrink-0">
      <EditorToolbar
        topic={ppt.topic}
        currentSlideIndex={activeIndex}
        totalSlides={ppt.slides.length}
        isSaving={isSaving}
        onSave={handleSave}
        onDownload={handleDownload}
        onDownloadPDF={handleExportPDF}
        onShare={handleShare}
        onPresent={handlePresent}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        currentTheme={ppt.templateId || "modern_blue"}
        onThemeChange={handleThemeChange}
        customThemeData={ppt.customTheme}
        onAddImage={handleImageUpload}
        onAddSlide={addSlide}
        onDeleteSlide={deleteSlide}
        currentLayout={ppt.slides[activeIndex]?.layout || "default"}
        onChangeLayout={handleLayoutChange}
      />
      </div>

      {isExportingPdf && (
        <div
          id="pdf-hidden-container"
          style={{
            position: 'absolute',
            top: '-10000px',
            left: '-10000px',
            width: '1280px',
            pointerEvents: 'none',
            zIndex: -100
          }}
        >
          {ppt.slides.map((slide, index) => (
            <div
              key={`pdf-${index}`}
              id={`pdf-slide-${index}`}
              style={{
                width: '1280px',
                height: '720px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <SlideCard
                slide={slide}
                index={index}
                totalSlides={ppt.slides.length}
                themeId={ppt.templateId || "modern_blue"}
                customThemeData={ppt.customTheme}
                readOnly={true}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* MAIN WORKSPACE */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className={`
            border-r bg-muted/30 flex-col h-full transition-all duration-300 ease-in-out
            ${isSidebarOpen ? "w-64 translate-x-0 opacity-100" : "w-0 -translate-x-full opacity-0 overflow-hidden"}
            hidden md:flex 
        `}>
          <ScrollArea className="flex-1 h-full">
            <SortableList
              slides={ppt.slides}
              currentSlideIndex={activeIndex}
              onSlideClick={(index) => setActiveIndex(index)}
              onReorder={handleReorder}
              activeTheme={ppt.templateId || "modern_blue"}
              customThemeData={ppt.customTheme}
            />
          </ScrollArea>
        </div>

        <div className="flex-1 bg-muted/10 flex flex-col min-w-0 relative">
            <SlideCarousel 
                slides={ppt.slides}
                activeIndex={activeIndex}
                onSlideChange={(index) => setActiveIndex(index)} 
                onUpdateSlide={handleSlideUpdate}
                activeTheme={ppt.templateId || "modern_blue"}
                customThemeData={ppt.customTheme}
            />
        </div>

      </div>
    </div>
  );
};

export default PresentationEditor;