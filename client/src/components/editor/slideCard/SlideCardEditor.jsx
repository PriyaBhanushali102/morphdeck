import React, { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import ResizableImage from "../ResizableImage";
import TipTapEditor from "../tiptapEditor/TipTapEditor";
import { generateAiImage } from "@/services/pptService";
import toast from "react-hot-toast";

const SlideCardEditor = ({
  slide, index, totalSlides, theme,
  currentLayout, alignmentClass,
  textContainerClass, sharedTitleClass,
  selectedImgIndex, onUpdate,
  onExternalSelect,
}) => {
  const containerRef = useRef(null);

  const handleGenerateAiImage = async () => {
    const loadingToast = toast.loading("AI is generating a visual...");
    try {
      const result = await generateAiImage(slide.title);
      if (result.success) {
        const autoX = currentLayout === "split_right" ? "58%" : "5%";
        const newImages = [...(slide.images || []), {
          url: result.url,
          x: autoX, y: "20%", w: "38%", h: "60%",
          rotate: 0, opacity: 1,
        }];
        onUpdate("images", newImages);
        toast.success("Image added!", { id: loadingToast });
      }
    } catch {
      toast.error("Failed to generate image", { id: loadingToast });
    }
  };

  const handleBackgroundClick = (e) => {
    const tag = e.target.tagName.toLowerCase();
    const isInteractive = tag === "input" || tag === "textarea" || tag === "img" || tag === "button";
    const isHandle = e.target.classList.contains("moveable-control") || e.target.classList.contains("moveable-line");
    if (!isInteractive && !isHandle) onExternalSelect(null);
  };

  const handleImageUpdate = (updateImgData, imgIndex) => {
    const newImages = [...(slide.images || [])];
    newImages[imgIndex] = updateImgData;
    onUpdate("images", newImages);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const el  = document.activeElement;
      const tag = el?.tagName?.toLowerCase();
      const isRealInput = tag === "input" || tag === "textarea";
      const isTipTap    = el?.classList?.contains("ProseMirror") || el?.closest?.(".ProseMirror");

      if (isRealInput) return;
      if (isTipTap && (selectedImgIndex === null || selectedImgIndex === undefined)) return;

      if ((e.key === "Delete" || e.key === "Backspace") && selectedImgIndex !== null && selectedImgIndex !== undefined) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const newImages = [...(slide.images || [])];
        newImages.splice(selectedImgIndex, 1);
        onUpdate("images", newImages);
        onExternalSelect(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [selectedImgIndex, slide.images, onUpdate, onExternalSelect]);

  return (
    <Card
      ref={containerRef}
      className="w-full h-full border-none relative rounded-xl shadow-2xl overflow-visible transition-all duration-500"
      style={{ backgroundColor: theme.colors.background, color: theme.colors.text, fontFamily: theme.font }}
      onPointerDown={handleBackgroundClick}
    >
      <CardContent className={`h-full flex flex-col p-8 md:p-10 overflow-visible relative ${alignmentClass}`}>

        {(currentLayout === "split_left" || currentLayout === "split_right") && (
          <Button
            onClick={handleGenerateAiImage}
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 gap-2 border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600"
          >
            <Wand2 size={14} /> AI Image
          </Button>
        )}

        <div className={textContainerClass}>
          <Textarea
            rows={1}
            className={`${sharedTitleClass} border-none shadow-none p-0 focus-visible:ring-0 bg-transparent resize-none overflow-hidden min-h-[40px]`}
            style={{ color: theme.colors.text }}
            value={slide.title}
            onChange={(e) => {
              onUpdate("title", e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />

          <div className="h-1.5 w-28 rounded-full mb-4 shrink-0" style={{ backgroundColor: theme.colors.accent }} />

          <ul className="flex-1 space-y-3 w-full relative z-10">
            {slide.content.map((item, i) => (
              <li
                key={`bullet-${i}-${slide.content.length}`}
                className={`flex items-start gap-3 group ${currentLayout === 'title_center' ? 'justify-center text-center' : ''}`}
              >
                {currentLayout !== "title_center" && (
                  <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: theme.colors.accent }} />
                )}
                <div className="flex-1 relative">
                  <TipTapEditor
                    content={item}
                    onChange={(html) => onUpdate('content', html, i)}
                    onAddBullet={() => {
                      const newContent = [...slide.content];
                      newContent.splice(i + 1, 0, "<p></p>");
                      onUpdate("content", newContent);
                      setTimeout(() => {
                        const editors = containerRef.current?.querySelectorAll('.ProseMirror');
                        if (editors?.[i + 1]) editors[i + 1].focus();
                      }, 100);
                    }}
                    onDeleteBullet={() => {
                      if (slide.content.length > 1) {
                        const newContent = slide.content.filter((_, idx) => idx !== i);
                        onUpdate("content", newContent);
                        setTimeout(() => {
                          const editors  = containerRef.current?.querySelectorAll('.ProseMirror');
                          const targetIndex = i > 0 ? i - 1 : 0;
                          if (editors?.[targetIndex]) editors[targetIndex].focus();
                        }, 100);
                      }
                    }}
                    readOnly={false}
                    theme={theme}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute inset-0 z-[100] pointer-events-none">
          {(slide.images || []).map((img, i) => (
            <div key={i} className="pointer-events-auto">
              <ResizableImage
                image={img}
                readOnly={false}
                isSelected={selectedImgIndex === i}
                onSelect={(e) => { e?.stopPropagation(); onExternalSelect(i); }}
                onUpdate={(newDetails) => handleImageUpdate(newDetails, i)}
              />
            </div>
          ))}
        </div>

        <div
          className="absolute bottom-4 right-8 text-sm opacity-40 shrink-0 pointer-events-none"
          style={{ color: theme.colors.text }} 
        >
          {index + 1} / {totalSlides}
        </div>
      </CardContent>
    </Card>
  );
};

export default SlideCardEditor;