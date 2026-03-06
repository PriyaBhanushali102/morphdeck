import React, { useState, useEffect, useRef } from 'react';
import { Type, Highlighter, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Wand2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { rewriteTextWithAi } from "@/services/pptService";
import { TEXT_COLORS,HIGHLIGHT_COLORS, FONT_SIZES, FONT_FAMILIES } from "@/config/editorConstants"; 

const TONES = [
  { label: "Professional", emoji: "👔", value: "professional" },
  { label: "Punchy & Short", emoji: "⚡", value: "punchy" },
  { label: "Expand Text",  emoji: "📝", value: "expand" },
];

const ToolbarButton = ({ onClick, isActive, title, children, className }) => (
  <Button
    variant={isActive ? 'secondary' : 'ghost'}
    size="icon"
    className={`h-7 w-7 ${className || ''}`}
    onClick={onClick}
    title={title}
    type="button"
  >
    {children}
  </Button>
);

const Divider = () => <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />;

const TipTapToolbar = ({ editor }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [isRewriting, setIsRewriting] = useState(false);
  const toolbarRef = useRef(null);

  if (!editor) return null;

  const handleAIRewrite = async (tone = "professional") => {
    if (editor.state.selection.empty) {
      toast.error("Please highlight some text first!");
      return;
    }

    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');

    setIsRewriting(true);
    const loadingToast = toast.loading("AI is rewriting...");

    try {
      const data = await rewriteTextWithAi(selectedText, tone);
      if (data.success) {
        editor.chain().focus().insertContent(data.data).run();
        toast.success("Text updated!", { id: loadingToast });
      } else {
        toast.error(data.message || "Failed to rewrite", { id: loadingToast });
      }
    } catch {
      toast.error("Rewrite failed. Please try again.", { id: loadingToast });
    } finally {
      setIsRewriting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={toolbarRef} className="flex flex-col gap-1 p-1.5 bg-white dark:bg-gray-800 border border-gray-800 dark:border-gray-700 rounded-md shadow-lg w-max text-slate-900 dark:text-slate-100">

      {/* Typography */}
      <div className="flex items-center gap-1">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()}      className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('bold')      ? 'bg-gray-200' : ''}`}><Bold size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()}    className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('italic')    ? 'bg-gray-200' : ''}`}><Italic size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}><Underline size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()}    className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('strike')    ? 'bg-gray-200' : ''}`}><Strikethrough size={14} /></ToolbarButton>

        {/* Font Size */}
        <select
          className="h-7 text-xs border border-gray-200 dark:border-gray-600 rounded px-1 bg-transparent cursor-pointer outline-none hover:bg-gray-50 dark:hover:bg-gray-700"
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value + 'px').run()}
          value={editor.getAttributes('textStyle').fontSize?.replace('px', '') || '16'}
        >
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>

        {/* Font Family */}
        <select
          className="h-7 text-xs border rounded px-1 bg-background cursor-pointer"
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          value={editor.getAttributes('textStyle').fontFamily || 'Inter'}
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
          ))}
        </select>

        {/* AI Rewrite */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === 'ai' ? null : 'ai')}
            disabled={isRewriting}
            className={`p-1.5 rounded flex items-center gap-1 transition-colors ${openMenu === 'ai' ? 'bg-blue-100 text-blue-700' : 'text-blue-600 hover:bg-blue-50'} ${isRewriting ? 'opacity-50' : ''}`}
          >
            {isRewriting ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
            <span className="text-xs font-semibold pr-1">Rewrite</span>
          </button>

          {openMenu === 'ai' && (
            <div className="absolute top-full left-0 mt-1 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl w-40 z-50 flex flex-col gap-0.5">
              <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1 px-2 pt-1">Select Tone</div>
              {TONES.map((tone) => (
                <button
                  key={tone.value}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { handleAIRewrite(tone.value); setOpenMenu(null); }}
                  className="text-left px-2 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2 text-gray-700 dark:text-gray-200"
                >
                  {tone.emoji} {tone.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-0.5" />

      {/* Layout + Colors */}
      <div className="flex items-center gap-1">
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()}   className="p-1 rounded hover:bg-gray-100"><AlignLeft size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} className="p-1 rounded hover:bg-gray-100"><AlignCenter size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()}  className="p-1 rounded hover:bg-gray-100"><AlignRight size={14} /></ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()}  className="p-1 rounded hover:bg-gray-100"><List size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} className="p-1 rounded hover:bg-gray-100"><ListOrdered size={14} /></ToolbarButton>
        <Divider />

        {/* Text Color */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === 'text' ? null : 'text')}
            className={`p-1 rounded flex items-center gap-1 hover:bg-gray-100 transition-colors ${openMenu === 'text' ? 'bg-gray-100' : ''}`}
            title="Text Color"
          >
            <Type size={14} style={{ color: editor.getAttributes('textStyle').color || 'inherit' }} />
          </button>
          {openMenu === 'text' && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl w-40 z-50">
              <div className="text-xs font-semibold text-gray-500 mb-2">Text Color</div>
              <div className="flex flex-wrap gap-1.5">
                {TEXT_COLORS.map(color => (
                  <button key={color} onMouseDown={(e) => e.preventDefault()} onClick={() => { editor.chain().focus().setColor(color).run(); setOpenMenu(null); }} className="w-5 h-5 rounded-full border border-gray-200 hover:scale-110 transition-transform" style={{ backgroundColor: color }} />
                ))}
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => { editor.chain().focus().unsetColor().run(); setOpenMenu(null); }} className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100" title="Clear">
                  <span className="text-[10px] text-gray-500">✕</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Highlight Color */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === 'highlight' ? null : 'highlight')}
            className={`p-1 rounded flex items-center gap-1 hover:bg-gray-100 transition-colors ${openMenu === 'highlight' ? 'bg-gray-100' : ''}`}
            title="Highlight Color"
          >
            <Highlighter size={14} style={{ color: editor.getAttributes('highlight').color || 'inherit' }} />
          </button>
          {openMenu === 'highlight' && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl w-40 z-50">
              <div className="text-xs font-semibold text-gray-500 mb-2">Highlight</div>
              <div className="flex flex-wrap gap-1.5">
                {HIGHLIGHT_COLORS.map(color => (
                  <button key={color} onMouseDown={(e) => e.preventDefault()} onClick={() => { editor.chain().focus().toggleHighlight({ color }).run(); setOpenMenu(null); }} className="w-5 h-5 rounded-full border border-gray-200 hover:scale-110 transition-transform" style={{ backgroundColor: color }} />
                ))}
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => { editor.chain().focus().unsetHighlight().run(); setOpenMenu(null); }} className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100" title="Clear">
                  <span className="text-[10px] text-gray-500">✕</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TipTapToolbar;