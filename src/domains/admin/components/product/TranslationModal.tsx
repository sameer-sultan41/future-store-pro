"use client";

import { useState, useEffect } from "react";
import { X, Save, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Input from "@/shared/components/UI/input";
import LanguageTabs from "./productForm/LanguageTabs";
import { ProductTranslation } from "@/shared/types/product";

type TranslationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    productName: string;
    onSave: (translations: Record<string, ProductTranslation>) => Promise<void>;
    existingTranslations?: Record<string, ProductTranslation>;
};

const TranslationModal = ({
    isOpen,
    onClose,
    productId,
    productName,
    onSave,
    existingTranslations = {},
}: TranslationModalProps) => {
    const [activeLanguage, setActiveLanguage] = useState<string>("ur");
    const [translations, setTranslations] = useState<Record<string, ProductTranslation>>({
        en: existingTranslations.en || { name: "", description: "", shortDescription: "" },
        ur: existingTranslations.ur || { name: "", description: "", shortDescription: "" },
        ar: existingTranslations.ar || { name: "", description: "", shortDescription: "" },
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (existingTranslations) {
            setTranslations({
                en: existingTranslations.en || { name: "", description: "", shortDescription: "" },
                ur: existingTranslations.ur || { name: "", description: "", shortDescription: "" },
                ar: existingTranslations.ar || { name: "", description: "", shortDescription: "" },
            });
        }
    }, [existingTranslations]);

    if (!isOpen) return null;

    const currentTranslation = translations[activeLanguage];

    const updateTranslation = (field: keyof ProductTranslation, value: string) => {
        setTranslations({
            ...translations,
            [activeLanguage]: {
                ...currentTranslation,
                [field]: value,
            },
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await onSave(translations);
            onClose();
        } catch (error) {
            console.error("Error saving translations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <Globe className="w-6 h-6 text-primary" />
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Product Translations
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                {productName}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {/* Language Tabs */}
                    <LanguageTabs
                        activeLanguage={activeLanguage}
                        onLanguageChange={setActiveLanguage}
                        availableLanguages={["en", "ur", "ar"]}
                    />

                    {activeLanguage === "en" && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                ℹ️ English is the default language. It's already saved from the product form.
                                You can view but not edit it here.
                            </p>
                        </div>
                    )}

                    {/* Translation Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Product Name ({activeLanguage.toUpperCase()})
                                {activeLanguage !== "en" && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <Input
                                type="text"
                                value={currentTranslation.name}
                                placeholder={`Enter product name in ${activeLanguage.toUpperCase()}`}
                                onChange={(e) => updateTranslation("name", e.target.value)}
                                disabled={activeLanguage === "en"}
                                className="py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Short Description ({activeLanguage.toUpperCase()})
                            </label>
                            <Input
                                type="text"
                                value={currentTranslation.shortDescription}
                                placeholder={`Brief description in ${activeLanguage.toUpperCase()}`}
                                onChange={(e) => updateTranslation("shortDescription", e.target.value)}
                                disabled={activeLanguage === "en"}
                                className="py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Description ({activeLanguage.toUpperCase()})
                            </label>
                            <textarea
                                value={currentTranslation.description}
                                placeholder={`Full product description in ${activeLanguage.toUpperCase()}`}
                                onChange={(e) => updateTranslation("description", e.target.value)}
                                disabled={activeLanguage === "en"}
                                rows={6}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Translations
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TranslationModal;

