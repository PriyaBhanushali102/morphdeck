import React, { useState, useRef, useCallback } from "react";
import Moveable from "react-moveable";

const ResizableImage = ({ image, isSelected, onSelect, onUpdate, readOnly }) => {
  const imgRef = useRef(null);
  const [imgEl, setImgEl] = useState(null);
  const [imgError, setImgError] = useState(false);

  const setRef = useCallback((node) => {
    imgRef.current = node;
    setImgEl(node);
  }, []);

  const style = {
    position: "absolute",
    left: image.x,
    top: image.y,
    width: image.w,
    height: image.h,
    transform: `rotate(${image.rotate || 0}deg)`,
    cursor: isSelected ? "move" : "pointer",
    userSelect: "none",
    touchAction: "none",
  };

  const handleSave = () => {
    const el = imgRef.current;
    if (!el) return;

    const parent = el.offsetParent;
    if (!parent) return;

    const parentW = parent.offsetWidth;
    const parentH = parent.offsetHeight;

    const xPct = ((el.offsetLeft / parentW) * 100).toFixed(2) + "%";
    const yPct = ((el.offsetTop  / parentH) * 100).toFixed(2) + "%";
    const wPct = ((el.offsetWidth  / parentW) * 100).toFixed(2) + "%";
    const hPct = ((el.offsetHeight / parentH) * 100).toFixed(2) + "%";

    const rotateMatch = el.style.transform.match(/rotate\(([-\d.]+)deg\)/);
    const finalRotate = rotateMatch ? parseFloat(rotateMatch[1]) : (image.rotate || 0);

    onUpdate({
      ...image,
      x: xPct,
      y: yPct,
      w: wPct,
      h: hPct,
      rotate: finalRotate,
    });
  };

  if (imgError) {
    return (
      <div
        style={{ ...style, cursor: "default" }}
        className="flex flex-col items-center justify-center bg-muted/30 border border-dashed border-muted-foreground/30 rounded-lg text-muted-foreground text-xs gap-1"
      >
        <span className="text-lg">🖼️</span>
        <span>Image unavailable</span>
      </div>
    );
  }

  return (
    <>
      <img
        ref={setRef}
        src={image.url}
        alt="slide-img"
        style={style}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onError={() => setImgError(true)}
        className={`object-cover rounded-lg shadow-sm ${
          isSelected
            ? "ring-2 ring-blue-500 z-50"
            : "z-10 hover:ring-2 hover:ring-blue-300"
        }`}
        onPointerDown={(e) => {
          e.stopPropagation();
          if (!readOnly) onSelect(e);
        }}
      />

      {isSelected && !readOnly && imgEl && (
        <Moveable
          target={imgEl}

          draggable={true}
          onDrag={({ target, left, top }) => {
            target.style.left = `${left}px`;
            target.style.top = `${top}px`;
          }}
          onDragEnd={handleSave}

          resizable={true}
          keepRatio={false}
          onResize={({ target, width, height, drag }) => {
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;
            target.style.left = `${drag.left}px`;
            target.style.top = `${drag.top}px`;
          }}
          onResizeEnd={handleSave}

          rotatable={true}
          throttleRotate={0}
          onRotate={({ target, absoluteRotation }) => {
            target.style.transform = `rotate(${absoluteRotation}deg)`;
          }}
          onRotateEnd={handleSave}

          origin={true}
          renderDirections={["nw","n","ne","w","e","sw","s","se"]}
        />
      )}
    </>
  );
};

export default ResizableImage;