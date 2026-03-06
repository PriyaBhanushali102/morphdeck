import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import ResizableImage from "../ResizableImage";

const SlideCardReadOnly = ({ slide, index, totalSlides, theme, currentLayout, alignmentClass, textContainerClass }) => (
  <Card
    className="w-full h-full border-none relative rounded-none shadow-none overflow-hidden"
    style={{ backgroundColor: theme.colors.background, color: theme.colors.text, fontFamily: theme.font }}
  >
    <CardContent className={`h-full flex flex-col px-[6%] pt-[4%] pb-[4%] justify-center ${alignmentClass}`}>
      <div className={textContainerClass}>
        {/* Title */}
        <h1 style={{ color: theme.colors.text, fontSize: "clamp(2.2rem, 4.5vw, 4rem)", marginBottom: "0.3em" }}>
          {slide.title}
        </h1>

        {/* Accent Bar */}
        <div
          className={`shrink-0 rounded-full mb-8 ${currentLayout === 'title_center' ? 'mx-auto' : ''}`}
          style={{ backgroundColor: theme.colors.accent, height: "5px", width: "130px" }}
        />

        {/* Bullets */}
        <ul className="flex flex-col justify-start gap-[1.8vh] w-full">
          {slide.content.map((item, i) => (
            <li key={i} className={`flex items-start gap-4 mb-2 ${currentLayout === 'title_center' ? 'justify-center' : ''}`}>
              {currentLayout !== "title_center" && (
                <span
                  className="rounded-full shrink-0 mt-3 md:mt-4"
                  style={{ backgroundColor: theme.colors.accent, width: "10px", height: "10px" }}
                />
              )}
              <span
                className="leading-snug text-lg md:text-xl [&_strong]:font-bold [&_b]:font-bold [&_em]:italic [&_i]:italic [&_u]:underline [&_s]:line-through [&_p]:block [&_p]:mb-2"
                style={{ color: theme.colors.secondary || theme.colors.text }}
                dangerouslySetInnerHTML={{ __html: item }}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Images */}
      <div className="absolute inset-0 z-[100] pointer-events-none">
        {(slide.images || []).map((img, i) => (
          <div key={i}>
            <ResizableImage image={img} readOnly={true} isSelected={false} onSelect={() => {}} onUpdate={() => {}} />
          </div>
        ))}
      </div>

      {/* Slide Number */}
      <div
        className="absolute bottom-4 right-8 opacity-40 text-xs md:text-sm"
        style={{ color: theme.colors.text }}
      >
        {index + 1} / {totalSlides}
      </div>
    </CardContent>
  </Card>
);

export default SlideCardReadOnly;