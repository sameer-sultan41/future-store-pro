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
import { useRouter, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

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



export function LanguageToggle({
  className,
  languages = DEFAULT_LANGS,
  showToast = true,
}: Omit<LanguageToggleProps, 'storageKey' | 'initial' | 'onChange'>) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = (code: string) => {
    if (code === locale) return;
    router.push(pathname, { locale: code });
    if (showToast) {
      try {
        toast?.success?.(`Language set to ${labelFor(code, languages)}`);
      } catch (_) {
        // ignore if toast not installed
      }
    }
  };

  const active = languages.find(l => l.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        <Button
          variant="outline"
          className={cn('shadow-sm uppercase', className)}
          aria-label="Change language"
          title={`Language: ${active?.label ?? locale}`}
        >
          <Globe className="h-4 w-4" /> {locale}
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
          const selected = lang.code === locale;
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