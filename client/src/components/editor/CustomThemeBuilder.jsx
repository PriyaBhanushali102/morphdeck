import React, { useState } from 'react';
import { PaintBucket,  Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SLIDE_FONTS } from '@/config/editorConstants';

const COLOR_LABELS = {
  background: 'Background',
  text:       'Text',
  accent:     'Accent',
  secondary:  'Secondary',
  border:     'Border',
};

const CustomThemeBuilder = ({ onApplyTheme, onClose, initialTheme }) => {
    const [customTheme, setCustomTheme] = useState({
        id: `custom_${Date.now()}`,
        name: 'My Custom Theme',
        colors: initialTheme?.colors || {
            background: '#ffffff',
            text: '#1e293b',
            accent: '#3b82f6',
            secondary: '#64748b',
            border: '#e2e8f0',
        },
        font: initialTheme?.font || 'Inter, sans-serif'
    });

    const handleColorChange = (key, value) => {
        setCustomTheme(prev => ({
            ...prev,
            colors: { ...prev.colors, [key]: value }
        }));
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-96 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="font-bold flex items-center gap-2">
                    <PaintBucket size={18} className="text-blue-500" />
                    Custom Theme
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-red-500">
                    <X size={18} />
                </button>
            </div>

            <div className="p-4 space-y-4">
                {/* Live Preview Card */}
                <div 
                    className="w-full h-24 rounded border shadow-inner p-3 flex flex-col justify-center"
                    style={{ backgroundColor: customTheme.colors.background, borderColor: customTheme.colors.border, fontFamily: customTheme.font }}
                >
                    <h4 style={{ color: customTheme.colors.text }} className="font-bold text-base m-0 leading-tight">Live Preview</h4>
                    <p style={{ color: customTheme.colors.secondary }} className="text-xs mt-1 mb-2">Secondary text looks like this.</p>
                    <div className="w-1/3 h-1.5 rounded-full" style={{ backgroundColor: customTheme.colors.accent }} />
                </div>

                {/* Color Pickers */}
                <div className="grid grid-cols-2 gap-4">
                    {Object.keys(customTheme.colors).map((key) => (
                        <div key={key} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded border dark:border-gray-700">
                            <span className="text-xs font-medium capitalize text-gray-700 dark:text-gray-300">{COLOR_LABELS[key] || key}</span>
                            <input 
                                type="color" 
                                value={customTheme.colors[key]}
                                onChange={(e) => handleColorChange(key, e.target.value)}
                                className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                            />
                        </div>
                    ))}
                </div>

                {/* Font Selector */}
                <div className="pt-2">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Slide Font</span>
                    <select 
                        value={customTheme.font}
                        onChange={(e) => setCustomTheme({...customTheme, font: e.target.value})}
                        className="w-full text-sm border rounded p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                    >
                        {SLIDE_FONTS.map(font => (
                            <option key={font.label} value={font.value} style={{ fontFamily: font.value }}>{font.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <Button onClick={() => onApplyTheme(customTheme)} className="w-full gap-2">
                    <Check size={16} /> Apply Theme
                </Button>
            </div>
        </div>
    )
}

export default CustomThemeBuilder;
