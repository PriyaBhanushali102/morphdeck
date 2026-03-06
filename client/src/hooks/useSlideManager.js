import { useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

// Helper
const isUserTyping = () => {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if (el.isContentEditable) {
    const isTipTap =
      el.classList.contains("ProseMirror") || el.closest(".ProseMirror");
    return !!isTipTap;
  }
  return false;
};

// Hook
const useSlideManager = (ppt, setPpt, activeIndex, setActiveIndex) => {
  const addSlide = useCallback(() => {
    if (!ppt) return;

    const newSlide = {
      _id: uuidv4(),
      title: "New Slide",
      content: ["Click to edit this point"],
      speakerNotes: "",
      images: [],
      layout: "default",
    };

    setPpt((prev) => {
      const newSlides = [...prev.slides];
      newSlides.splice(activeIndex + 1, 0, newSlide);
      return { ...prev, slides: newSlides };
    });

    setActiveIndex(activeIndex + 1);
  }, [ppt, setPpt, activeIndex, setActiveIndex]);

  const deleteSlide = useCallback(
    (index) => {
      const targetIndex = typeof index === "number" ? index : activeIndex;

      if (!ppt || ppt.slides.length <= 1) {
        toast.error("You cannot delete the only slide.");
        return;
      }

      setPpt((prev) => {
        const newSlides = prev.slides.filter((_, i) => i !== targetIndex);
        return { ...prev, slides: newSlides };
      });
      if (targetIndex === activeIndex) {
        setActiveIndex((p) => Math.max(0, p - 1));
      } else if (targetIndex < activeIndex) {
        setActiveIndex((p) => p - 1);
      }

      toast.success("Slide deleted");
    },
    [ppt, setPpt, activeIndex, setActiveIndex],
  );

  const duplicateSlide = useCallback(() => {
    if (!ppt) return;
    const slideToCopy = ppt.slides[activeIndex];

    const newSlide = {
      ...structuredClone(slideToCopy),
      _id: uuidv4(),
      title: `${slideToCopy.title} (Copy)`,
    };

    setPpt((prev) => {
      const newSlides = [...prev.slides];
      newSlides.splice(activeIndex + 1, 0, newSlide);
      return { ...prev, slides: newSlides };
    });
    setActiveIndex(activeIndex + 1);
  }, [ppt, setPpt, activeIndex, setActiveIndex]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isUserTyping()) return;

      if (e.key === "Delete" && (e.ctrlKey || e.metaKey)) deleteSlide();

      if (e.key === "Enter") {
        e.preventDefault();
        addSlide();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        duplicateSlide();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [addSlide, deleteSlide, duplicateSlide]);

  return {
    addSlide,
    deleteSlide,
    duplicateSlide,
  };
};

export default useSlideManager;
