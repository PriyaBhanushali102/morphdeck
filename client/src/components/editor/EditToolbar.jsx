import React, { useRef , useState} from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, FileText, Download, Share2, Loader2, Play,Menu, MoreVertical, Palette, Check, Image as ImageIcon, Plus, Trash2, LayoutTemplate} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { THEMES, getThemeById } from "@/config/themes";
import { LAYOUTS } from "@/config/editorConstants";
import CustomThemeBuilder from "./CustomThemeBuilder";

const EditorToolbar = ({
    topic,
    currentSlideIndex,
    totalSlides,
    isSaving,
    onSave,
    onDownload,
    onDownloadPDF,
    onShare,
    onPresent,
    onToggleSidebar,
    currentTheme,
    customThemeData,
    onThemeChange,
    onAddImage,
    onAddSlide,
    onDeleteSlide,
    currentLayout = "default",
    onChangeLayout
}) => {
    const fileInputRef = useRef(null);
    const [showThemeModal, setShowThemeModal] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && onAddImage) {
            onAddImage(file);
        }
        e.target.value = null;
    };

    return (
        <div className="flex h-16 items-center justify-between border-b px-6 bg-card shrink-0">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
            />
            
            {/* Left Section */}
            <div className="flex items-center gap-1 flex-1 min-w-0">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onToggleSidebar}
                    className="mr-1 text-muted-foreground"
                    title="Toggle Sidebar"
                >
                    <Menu size={20} />
                </Button>

                <Link to="/library">
                    <Button variant="ghost" size="icon" title="Back to Library">
                        <ArrowLeft size={20} />   
                    </Button>
                </Link>
                <div className="min-w-0 ml-1">
                    <h2 className="font-semibold text-sm md:text-lg truncate max-w-[300px]" title={topic}>
                        {topic || "Untitled Presentation"}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Slide {currentSlideIndex + 1} of {totalSlides}
                    </p>
                </div>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center gap-1 md:gap-2 shrink-0">

                <div className="flex items-center border-r pr-1 md:pr-2 mr-1 md:mr-2 gap-1">
                    <Button variant="ghost" size="sm" onClick={onAddSlide} title="Add New Slide (After current)">
                        <Plus className="h-5 w-5 md:h-4 md:w-4 text-green-600" />
                        <span className="hidden md:inline ml-2">Add</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteSlide()} title="Delete Current Slide (Delete Key)">
                        <Trash2 className="h-5 w-5 md:h-4 md:w-4 text-red-500" />
                    </Button>
                </div>

                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()} 
                    className="flex items-center gap-2"
                >
                    <ImageIcon className="h-5 w-5 md:h-4 md:w-4" />
                </Button>
                
                {/* Layout Picker */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2" title="Change Layout">
                            <LayoutTemplate className="h-5 w-5 md:h-4 md:w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Slide Layout</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {LAYOUTS.map((layout) => (
                            <DropdownMenuItem 
                                key={layout.id}
                                onClick={() => onChangeLayout(layout.id)}
                                className="flex items-center gap-3 cursor-pointer"
                            >
                                <span className="flex-1">{layout.name}</span>
                                {currentLayout === layout.id && <Check className="h-4 w-4 text-blue-600" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Theme Picker */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <Palette className="h-5 w-5 md:h-4 md:w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {THEMES.map((theme) => (
                            <DropdownMenuItem 
                                key={theme.id}
                                onClick={() => onThemeChange(theme.id)}
                                className="flex items-center gap-3 cursor-pointer"
                            >
                                <div 
                                    className="h-4 w-4 rounded-full border shadow-sm" 
                                    style={{ background: theme.colors.background }} 
                                />
                                <span>{theme.name}</span>
                                {currentTheme === theme.id && <Check className="ml-auto h-4 w-4" />}
                            </DropdownMenuItem>
                        ))}

                        <DropdownMenuItem onClick={() => setShowThemeModal(true)} className="cursor-pointer text-blue-600 font-medium">
                            <Plus className="mr-2 h-4 w-4" /> Create Custom Theme
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onShare}>
                    <Share2 className="mr-2 h-4 w-4" /> 
                </Button>
                <Button variant="secondary" size="sm" onClick={onPresent}>
                    <Play className="mr-2 h-4 w-4" /> 
                </Button>
                <Button variant="outline" size="sm" onClick={onDownload}>
                    <Download className="mr-2 h-4 w-4" /> 
                </Button>
                <Button variant="outline" size="sm" onClick={onDownloadPDF}>
                    <FileText className="mr-2 h-4 w-4" />
                </Button>
                <Button size="sm" onClick={onSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save
                </Button>
                </div>

                {/* Mobile Save */}
                <Button size="icon" variant="ghost" onClick={onSave} disabled={isSaving} className="md:hidden">
                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                </Button>

                {/* Mobile More Menu */}
                <div className="md:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical size={20} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={onPresent}>
                                <Play className="mr-2 h-4 w-4" /> Present
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onDownload}>
                                <Download className="mr-2 h-4 w-4" /> Export
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onShare}>
                                <Share2 className="mr-2 h-4 w-4" /> Share
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onDownloadPDF}>
                                <FileText className="mr-2 h-4 w-4" /> PDF
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>

            {/* Custom Theme Modal */}
            {showThemeModal && (
                <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <CustomThemeBuilder 
                        initialTheme={
                            currentTheme === "custom" && customThemeData 
                                ? customThemeData 
                                : getThemeById(currentTheme)
                        }
                        onClose={() => setShowThemeModal(false)} 
                        onApplyTheme={(customThemeObject) => {
                            onThemeChange(customThemeObject);
                            setShowThemeModal(false);
                        }} 
                    />
                </div>
            )}
        </div>
    )
}

export default EditorToolbar;