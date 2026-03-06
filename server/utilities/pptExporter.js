import pptxgen from "pptxgenjs";

const fetchImageAsBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const base64 = Buffer.from(await response.arrayBuffer()).toString("base64");
    const mimeType = response.headers.get("content-type") || "image/png";
    return `data:${mimeType};base64,${base64}`;
  } catch {
    return null;
  }
};

const NAMED_COLORS = {
  RED: "FF0000",
  BLUE: "0000FF",
  GREEN: "008000",
  BLACK: "000000",
  WHITE: "FFFFFF",
  YELLOW: "FFFF00",
  CYAN: "00FFFF",
  MAGENTA: "FF00FF",
};

const toSafePptxColor = (colorStr, fallback) => {
  if (!colorStr || colorStr === "transparent" || colorStr === "none")
    return fallback;
  if (/rgba\([^)]+,\s*0\)/i.test(colorStr)) return fallback;

  // RGB format
  const rgbMatch = colorStr.match(
    /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i,
  );
  if (rgbMatch) {
    return [rgbMatch[1], rgbMatch[2], rgbMatch[3]]
      .map((n) => parseInt(n).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  }

  const hex = colorStr.replace("#", "").trim().toUpperCase();
  if (NAMED_COLORS[hex]) return NAMED_COLORS[hex];
  if (/^[0-9A-F]{6}$/i.test(hex)) return hex;

  return fallback;
};

const parseHtmlToPptxBullets = (htmlString, theme, useBullets, contentOpts) => {
  if (!htmlString) return [];

  const cleaned = htmlString
    .replace(/<ul[^>]*>|<ol[^>]*>|<\/ul>|<\/ol>/gi, "")
    .replace(/<li[^>]*>/gi, "")
    .replace(/<\/li>/gi, "|||");

  const paragraphs = cleaned
    .replace(/<\/p>|<\/div>|<br\s*\/?>/gi, "|||")
    .split("|||")
    .map((p) => p.trim())
    .filter(Boolean);

  const result = [];

  for (const paragraphHtml of paragraphs) {
    const tokenRegex = /(<[^>]+>)|([^<]+)/g;
    let match;
    let isBold = false,
      isItalic = false,
      isUnderline = false,
      isStrike = false;
    let currentColor = toSafePptxColor(theme.text, "000000");
    let currentHighlight;
    let currentFont = theme.font || "Arial";
    let currentSize = contentOpts.fontSize || 16;
    let isFirst = true;

    while ((match = tokenRegex.exec(paragraphHtml)) !== null) {
      const tag = match[1];
      let text = match[2];

      if (tag) {
        const t = tag.toLowerCase();
        const is = (name) => t === `<${name}>` || t.startsWith(`<${name} `);
        const isClose = (name) => t === `</${name}>`;

        if (is("strong") || is("b")) isBold = true;
        if (isClose("strong") || isClose("b")) isBold = false;
        if (is("em") || is("i")) isItalic = true;
        if (isClose("em") || isClose("i")) isItalic = false;
        if (is("u")) isUnderline = true;
        if (isClose("u")) isUnderline = false;
        if (is("s") || is("strike")) isStrike = true;
        if (isClose("s") || isClose("strike")) isStrike = false;

        if (is("span")) {
          const colorMatch = tag.match(/color:\s*([^;>"]+)/i);
          if (colorMatch)
            currentColor = toSafePptxColor(colorMatch[1].trim(), currentColor);

          const fontMatch = tag.match(/font-family:\s*([^;>"]+)/i);
          if (fontMatch) currentFont = fontMatch[1].replace(/['"]/g, "").trim();

          const sizeMatch = tag.match(/font-size:\s*(\d+)px/i);
          if (sizeMatch)
            currentSize = Math.round(parseInt(sizeMatch[1]) * 0.75);
        }

        if (isClose("span")) {
          currentColor = toSafePptxColor(theme.text, "000000");
          currentFont = theme.font || "Arial";
          currentSize = contentOpts.fontSize || 16;
        }

        if (is("mark")) {
          const markMatch = tag.match(
            /data-color=["']?(#[a-fA-F0-9]{3,8})["']?/i,
          );
          currentHighlight = toSafePptxColor(markMatch?.[1], undefined);
        }
        if (isClose("mark")) currentHighlight = undefined;
      } else if (text) {
        text = text
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">");

        if (!text.trim()) continue;

        const opts = {
          color: currentColor,
          fontFace: currentFont,
          fontSize: currentSize,
        };
        if (isBold) opts.bold = true;
        if (isItalic) opts.italic = true;
        if (isUnderline) opts.underline = true;
        if (isStrike) opts.strike = true;
        if (currentHighlight) opts.highlight = currentHighlight;

        if (isFirst) {
          opts.paraSpaceAfter = 12;
          if (useBullets) {
            opts.bullet = true;
            opts.indent = 20;
          }
          isFirst = false;
        }

        result.push({ text, options: opts });
      }
    }

    if (result.length > 0) result[result.length - 1].options.breakLine = true;
  }

  return result;
};

// Layout Builder
const buildLayoutOpts = (layout, isLongTitle) => {
  const base = {
    title: {
      x: 0.5,
      y: 0.4,
      w: "90%",
      h: isLongTitle ? 1.3 : 0.7,
      fontSize: isLongTitle ? 30 : 34,
      bold: true,
      valign: "top",
      align: "left",
    },
    line: { x: 0.5, y: isLongTitle ? 1.6 : 1.15, w: 1.5, h: 0.06 },
    content: {
      x: 0.5,
      y: isLongTitle ? 2.0 : 1.45,
      w: "90%",
      h: "65%",
      fontSize: 16,
      valign: "top",
      margin: [0, 0, 10, 0],
      align: "left",
      lineSpacing: 22,
    },
  };

  if (layout === "title_center") {
    base.title = {
      ...base.title,
      y: 0.6,
      h: isLongTitle ? 1.2 : 0.8,
      fontSize: 34,
      align: "center",
    };
    base.line = { ...base.line, x: 4.25, y: isLongTitle ? 1.85 : 1.45 };
    base.content = {
      ...base.content,
      y: isLongTitle ? 2.05 : 1.65,
      align: "center",
      fontSize: 18,
      lineSpacing: 26,
    };
  } else if (layout === "split_right") {
    base.content.w = "48%";
  } else if (layout === "split_left") {
    base.content.x = "50%";
    base.content.w = "45%";
  }

  return base;
};

// Main Export
export const generatePptxBuffer = async (pptData, theme) => {
  const pres = new pptxgen();

  const safeBg = toSafePptxColor(theme.bg, "FFFFFF");
  const safeText = toSafePptxColor(theme.text, "000000");
  const safeAccent = toSafePptxColor(theme.accent, "2563EB");

  pres.defineSlideMaster({
    title: "MASTER_SLIDE",
    background: { color: safeBg },
  });

  for (const [index, slideItem] of pptData.slides.entries()) {
    const slide = pres.addSlide({ masterName: "MASTER_SLIDE" });
    const layout = slideItem.layout || "default";
    const titleText = slideItem.title || " ";
    const isLongTitle = titleText.length > 35;

    const {
      title: titleOpts,
      line: lineOpts,
      content: contentOpts,
    } = buildLayoutOpts(layout, isLongTitle);

    // Apply theme colors
    titleOpts.color = safeText;
    titleOpts.fontFace = theme.font || "Arial";
    contentOpts.color = safeText;
    contentOpts.fontFace = theme.font || "Arial";

    slide.addText(titleText, titleOpts);

    if (layout !== "title_center")
      slide.addShape(pres.ShapeType.rect, {
        ...lineOpts,
        fill: { color: safeAccent },
      });

    // Content
    const formattedText = (slideItem.content || []).flatMap((htmlItem) =>
      parseHtmlToPptxBullets(
        htmlItem,
        theme,
        layout !== "title_center",
        contentOpts,
      ),
    );

    if (formattedText.length > 0) slide.addText(formattedText, contentOpts);

    // Images
    for (const img of slideItem.images || []) {
      const base64Data = await fetchImageAsBase64(img.url);
      if (!base64Data) continue;
      slide.addImage({
        data: base64Data,
        x: img.x || "50%",
        y: img.y || "2.0",
        w: img.w || "40%",
        h: img.h || "50%",
        rotate: img.rotate || 0,
        transparency:
          img.opacity != null ? Math.round((1 - img.opacity) * 100) : 0,
      });
    }

    // Page number
    slide.addText(`${index + 1} / ${pptData.slides.length}`, {
      x: "90%",
      y: "90%",
      w: "10%",
      fontSize: 10,
      color: safeText,
      align: "right",
    });
  }

  return pres.write({ outputType: "nodebuffer" });
};
