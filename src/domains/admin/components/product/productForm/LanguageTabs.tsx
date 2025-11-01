"use client";

import { cn } from "@/lib/utils";

type Language = {
    code: string;
    name: string;
    nativeName: string;
};

const SUPPORTED_LANGUAGES: Language[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "ur", name: "Urdu", nativeName: "اردو" },
    { code: "ar", name: "Arabic", nativeName: "العربية" },
];

type LanguageTabsProps = {
    activeLanguage: string;
    onLanguageChange: (langCode: string) => void;
    availableLanguages?: string[];
};

const LanguageTabs = ({
    activeLanguage,
    onLanguageChange,
    availableLanguages = ["en", "ur", "ar"],
}: LanguageTabsProps) => {
    const languages = SUPPORTED_LANGUAGES.filter((lang) =>
        availableLanguages.includes(lang.code)
    );

    return (
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-6">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    type="button"
                    onClick={() => onLanguageChange(lang.code)}
                    className={cn(
                        "flex-1 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200",
                        activeLanguage === lang.code
                            ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    )}
                >
                    <span className="mr-2">{lang.nativeName}</span>
                    <span className="text-xs opacity-70">({lang.code.toUpperCase()})</span>
                </button>
            ))}
        </div>
    );
};

export default LanguageTabs;

