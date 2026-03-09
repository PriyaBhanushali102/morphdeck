import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade, Keyboard } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from "lucide-react";
import SlideCard from "./SlideCard";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const SlideCarousel = ({ slides, activeIndex, customThemeData, onSlideChange, onUpdateSlide, viewMode = "default", activeTheme }) => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [selectedImg, setSelectedImg]       = useState({ slideIndex: null, imgIndex: null });
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      if (selectedImg.slideIndex === null || selectedImg.imgIndex === null) return;

      const el  = document.activeElement;
      const tag = el?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (el?.classList?.contains("ProseMirror") || el?.closest?.(".ProseMirror")) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      const newImages = (slides[selectedImg.slideIndex].images || []).filter((_, i) => i !== selectedImg.imgIndex);
      onUpdateSlide(selectedImg.slideIndex, "images", newImages);
      setSelectedImg({ slideIndex: null, imgIndex: null });
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [selectedImg, slides, onUpdateSlide]);

  useEffect(() => {
    if (swiperInstance && !swiperInstance.destroyed) {
      const isLocked = selectedImg.imgIndex !== null;
      swiperInstance.allowSlideNext = !isLocked;
      swiperInstance.allowSlidePrev = !isLocked;
      swiperInstance.allowTouchMove = !isLocked;
    }
  }, [swiperInstance, selectedImg]);

  useEffect(() => {
    if (swiperInstance && !swiperInstance.destroyed && swiperInstance.activeIndex !== activeIndex) {
      swiperInstance.slideTo(activeIndex);
    }
  }, [activeIndex, swiperInstance]);

  const isPresenting = viewMode === "present";

  return (
    <div className={`flex-1 w-full flex items-center justify-center ${isPresenting ? "bg-white fixed inset-0 z-[50]" : "bg-muted/10 relative"} overflow-hidden group`}>
      <div className={`w-full ${isPresenting ? "h-screen w-screen" : "max-w-5xl aspect-video relative flex items-center"}`}>

        {!isPresenting && (
          <>
            <button
              ref={prevRef}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 p-4 text-muted-foreground hover:text-primary transition-all duration-200 hidden md:flex items-center justify-center cursor-pointer ${selectedImg.imgIndex !== null ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            >
              <ChevronLeft size={48} className="drop-shadow-sm" />
            </button>
            <button
              ref={nextRef}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 p-4 text-muted-foreground hover:text-primary transition-all duration-200 hidden md:flex items-center justify-center cursor-pointer ${selectedImg.imgIndex !== null ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            >
              <ChevronRight size={48} className="drop-shadow-sm" />
            </button>
          </>
        )}

        <Swiper
          modules={[Navigation, Keyboard, EffectFade]}
          spaceBetween={isPresenting ? 0 : 40}
          slidesPerView={1}
          effect={isPresenting ? "fade" : "slide"}
          fadeEffect={{ crossFade: true }}
          navigation={!isPresenting ? { prevEl: prevRef.current, nextEl: nextRef.current } : false}
          onBeforeInit={(swiper) => {
            if (!isPresenting) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          keyboard={{ enabled: true }}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => onSlideChange(swiper.activeIndex)}
          initialSlide={activeIndex}
          className="w-full h-full"
          allowTouchMove={!isPresenting && selectedImg.imgIndex === null}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide._id || index}>
              <div className={`w-full h-full flex items-center justify-center ${isPresenting ? "p-0" : "px-12 py-2"}`}>
                <div className={isPresenting ? "w-full h-full card-wrapper" : "w-full h-full"}>
                  <SlideCard
                    slide={slide}
                    index={index}
                    totalSlides={slides.length}
                    onUpdate={(field, value, bulletIndex) => onUpdateSlide(index, field, value, bulletIndex)}
                    readOnly={isPresenting}
                    themeId={activeTheme}
                    customThemeData={customThemeData}
                    externalSelectedId={selectedImg.slideIndex === index ? selectedImg.imgIndex : null}
                    onExternalSelect={(imgIdx) =>
                      setSelectedImg(imgIdx !== null ? { slideIndex: index, imgIndex: imgIdx } : { slideIndex: null, imgIndex: null })
                    }
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SlideCarousel;