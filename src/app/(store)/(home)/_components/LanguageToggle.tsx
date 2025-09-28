'use client';

import * as React from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils'; // shadcn helper (or inline your own)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner'; // optional (remove if not using)
import { Check } from "lucide-react";

type Lang = {
  code: string;       // e.g. "en", "de", "ar", "ur"
  label: string;      // e.g. "English"
  flag?: string;      // emoji flag (e.g. "🇺🇸") or short text
  rtl?: boolean;      // true for RTL langs (ar, ur, fa, he, etc.)
};

type LanguageToggleProps = {
  className?: string;
  languages?: Lang[];
  storageKey?: string;                 // localStorage key (default: 'app.lang')
  initial?: string;                    // default code if nothing stored
  onChange?: (code: string) => void;   // hook into next-intl / i18next / router
  showToast?: boolean;                 // set false to disable toasts
};

const DEFAULT_LANGS: Lang[] = [
  { code: 'en', label: 'English', flag: '🇺🇸', rtl: false },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'ur', label: 'اردو', flag: '🇵🇰', rtl: true },
];

const isBrowser = typeof window !== 'undefined';

export function LanguageToggle({
  className,
  languages = DEFAULT_LANGS,
  storageKey = 'app.lang',
  initial,
  onChange,
  showToast = true,
}: LanguageToggleProps) {
  const getDefault = React.useCallback(() => {
    if (!isBrowser) return initial ?? languages[0]?.code ?? 'en';
    return (
      localStorage.getItem(storageKey) ||
      initial ||
      document.documentElement.lang ||
      languages[0]?.code ||
      'en'
    );
  }, [initial, languages, storageKey]);

  const [current, setCurrent] = React.useState<string>(getDefault);

  // Keep <html lang> & dir in sync
  const applyHtmlAttrs = React.useCallback(
    (code: string) => {
      const lang = languages.find(l => l.code === code);
      const html = document.documentElement;
      html.setAttribute('lang', code);
      // html.setAttribute('dir', lang?.rtl ? 'rtl' : 'ltr');

      // Optional: flip body text alignment for RTL to feel natural
      document.body.classList.toggle('rtl', !!lang?.rtl);
    },
    [languages]
  );

  React.useEffect(() => {
    if (!isBrowser) return;
    applyHtmlAttrs(current);
  }, [current, applyHtmlAttrs]);

  const handleSelect = (code: string) => {
    setCurrent(code);
    if (isBrowser) {
      localStorage.setItem(storageKey, code);
      applyHtmlAttrs(code);
    }
    onChange?.(code);
    if (showToast) {
      try {
        toast?.success?.(`Language set to ${labelFor(code, languages)}`);
      } catch (_) {
        // ignore if toast not installed
      }
    }
  };

  const active = languages.find(l => l.code === current);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        <Button
          variant="outline"
          className={cn('shadow-sm uppercase', className)}
          aria-label="Change language"
          title={`Language: ${active?.label ?? current}`}
        >
          <Globe className="h-4 w-4" /> {current}
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Language
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => {
          const selected = lang.code === current;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={cn(
                'flex items-center gap-2 cursor-pointer justify-between',
                selected && 'bg-accent'
              )}
            >
              <span className="text-base leading-none">{lang.flag ?? '🌐'}</span>
              <span className="flex-1">{lang.label}</span>
              {selected && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Helper
function labelFor(code: string, languages: Lang[]) {
  return languages.find(l => l.code === code)?.label ?? code;
}