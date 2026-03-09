import React from "react";
import { getThemeById } from "@/config/themes";
import SlideCardEditor from "./slideCard/SlideCardEditor";
import SlideCardReadOnly from "./slideCard/SlideCardReadOnly";

const getLayoutClasses = (layout) => {
  switch (layout) {
    case "split_right":
      return {
        textContainerClass: "w-[55%] relative z-10 flex-1 pr-6 flex flex-col justify-center",
        alignmentClass:     "items-start text-left",
        sharedTitleClass:   "font-bold shrink-0 leading-tight w-full text-2xl md:text-4xl mb-3 text-left",
      };
    case "split_left":
      return {
        textContainerClass: "w-[55%] relative z-10 flex-1 pl-6 ml-auto flex flex-col justify-center",
        alignmentClass:     "items-start text-left",
        sharedTitleClass:   "font-bold shrink-0 leading-tight w-full text-2xl md:text-4xl mb-3 text-left",
      };
    case "title_center":
      return {
        textContainerClass: "w-full relative z-10 flex-1 flex flex-col items-center justify-center text-center",
        alignmentClass:     "items-center text-center",
        sharedTitleClass:   "font-bold shrink-0 leading-tight w-full text-4xl md:text-5xl mb-6 text-center",
      };
    default:
      return {
        textContainerClass: "w-full relative z-10 flex-1 flex flex-col justify-center",
        alignmentClass:     "items-start text-left",
        sharedTitleClass:   "font-bold shrink-0 leading-tight w-full text-2xl md:text-4xl mb-3 text-left",
      };
  }
};

const SlideCard = ({
  slide, index, totalSlides, onUpdate,
  themeId = "modern_blue", readOnly = false,
  customThemeData, externalSelectedId, onExternalSelect,
}) => {
  const theme = themeId === "custom" && customThemeData
    ? customThemeData
    : getThemeById(themeId);

  const currentLayout = slide.layout || "default";
  const layoutClasses = getLayoutClasses(currentLayout);

  const sharedProps = {
    slide, index, totalSlides, theme,
    currentLayout, ...layoutClasses,
  };

  if (readOnly) return <SlideCardReadOnly {...sharedProps} />;

  return (
    <SlideCardEditor
      {...sharedProps}
      selectedImgIndex={externalSelectedId}
      onUpdate={onUpdate}
      onExternalSelect={onExternalSelect}
    />
  );
};

export default SlideCard;