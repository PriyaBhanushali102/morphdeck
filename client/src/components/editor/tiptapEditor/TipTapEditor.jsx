import { useEditor, EditorContent, Extension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {TextStyle} from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import TipTapToolbar from './TipTapToolbar';
import { useEffect } from 'react'
import FontSize from '@/config/fontSize';

const TipTapEditor = ({ content, onChange, readOnly = false, theme, onAddBullet, onDeleteBullet }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            FontFamily,
            FontSize,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({types: ['heading', 'paragraph']}),
        ],
        content: content || '<p></p>',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editable: !readOnly,
        editorProps: {
            attributes: {
                class: 'outline-none w-full min-h-[30px] leading-relaxed [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:mb-1',
            },
            handleKeyDown: (view, event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault(); 
                        if (onAddBullet) {
                        setTimeout(() => onAddBullet(), 10);
                        }
                        return true;
                }
                if (event.key === "Backspace" && view.state.doc.textContent.trim() === "") {
                        event.preventDefault();
                        if (onDeleteBullet) {
                        setTimeout(() => onDeleteBullet(), 10);
                        }
                        return true;
                }
                return false;
            }
        },
    })

    useEffect(() => {
        if (editor && content !== undefined) {
            const currentHtml = editor.getHTML();
            if (currentHtml !== content && currentHtml !== `<p>${content}</p>`) {
                editor.commands.setContent(content, false); 
            }
        }
    }, [content, editor]);

    useEffect(() => {
        if (editor) {
            editor.setEditable(!readOnly);
        }
    }, [readOnly, editor]);

    const handleBlur = (e) => {
        if (e.currentTarget.contains(e.relatedTarget)) {
            return;
        }
    };

    return (
        <div
            className="flex-1 w-full relative group"
            onBlur={handleBlur}
        >
            {editor && !readOnly && (
                <div 
                    className={`absolute bottom-full left-0 z-50 mb-1 transition-opacity duration-200 ${
                    editor.isFocused && !editor.state.selection.empty 
                        ? 'opacity-100 visible' 
                        : 'opacity-0 invisible pointer-events-none'
                }`}
                >
                    <TipTapToolbar editor={editor} />
                </div>
            )}

            <EditorContent
                editor={editor}
                style={{
                    color: theme?.colors?.text,
                    fontFamily: theme?.font,
                }}
            />
        </div>
    )
}

export default TipTapEditor;