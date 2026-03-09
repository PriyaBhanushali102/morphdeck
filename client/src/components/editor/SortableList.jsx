import React from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import { getThemeById } from "@/config/themes";

const SlideItem = ({ slide, index, isActive, onClick, themeId, customThemeData }) => {
  const controls = useDragControls();
  const theme = themeId === "custom" && customThemeData
    ? customThemeData
    : getThemeById(themeId);

  return (
    <Reorder.Item
      value={slide}
      id={slide._id || `slide-${index}`}
      dragListener={false}
      dragControls={controls}
      className="relative select-none"
    >
      <Card
        onClick={() => onClick(index)}
        className={`cursor-pointer transition-all border-l-4 select-none relative ${
          isActive
            ? "border-l-primary bg-primary/5 ring-2 ring-primary/20"
            : "border-l-transparent hover:bg-muted/50"
        }`}
        style={{
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          fontFamily: theme.font,
          borderLeftColor: isActive ? theme.colors.accent : "transparent",
          borderColor: isActive ? theme.colors.accent : "transparent",
        }}
      >
        <CardContent className="p-3 pl-10">
          <div className="text-[10px] font-bold text-muted-foreground mb-1">SLIDE {index + 1}</div>
          <div className="text-xs font-medium line-clamp-2">{slide.title || "Untitled Slide"}</div>
        </CardContent>

        <div
          onPointerDown={(e) => controls.start(e)}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground/50 hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical size={16} />
        </div>
      </Card>
    </Reorder.Item>
  );
};

const SortableList = ({ slides, currentSlideIndex, onSlideClick, onReorder, activeTheme, customThemeData }) => (
  <Reorder.Group axis="y" values={slides} onReorder={onReorder} className="flex flex-col gap-4 p-4 pb-20">
    {slides.map((slide, index) => (
      <SlideItem
        key={slide._id || `slide-${index}`}
        slide={slide}
        index={index}
        isActive={currentSlideIndex === index}
        onClick={onSlideClick}
        themeId={activeTheme}
        customThemeData={customThemeData}
      />
    ))}
  </Reorder.Group>
);

export default SortableList;