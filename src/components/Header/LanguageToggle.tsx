"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils"; // shadcn helper (or inline your own)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // optional (remove if not using)
import { Check } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Language } from "@/actions/type";
import { getLanguages } from "@/actions/server";

type LanguageToggleProps = {
  className?: string;
  languages?: Language[];
  storageKey?: string; // localStorage key (default: 'app.lang')
  initial?: string; // default code if nothing stored
  onChange?: (code: string) => void; // hook into next-intl / i18next / router
  showToast?: boolean; // set false to disable toasts
};

export function LanguageToggle({
  className,
  languages: propLanguages,
  showToast = true,
}: Omit<LanguageToggleProps, "storageKey" | "initial" | "onChange">) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [fetchedLanguages, setFetchedLanguages] = React.useState<Language[]>([]);

  React.useEffect(() => {
    if (!propLanguages) {
      getLanguages().then(({ languages }) => {
        if (languages) setFetchedLanguages(languages);
      });
    }
  }, [propLanguages]);

  const languages = propLanguages || fetchedLanguages;

  const handleSelect = (code: string) => {
    if (code === locale) return;
    router.push(pathname, { locale: code });
    if (showToast) {
      try {
        toast?.success?.(`Language set to ${native_nameFor(code, languages ?? [])}`);
      } catch (_) {
        // ignore if toast not installed
      }
    }
  };

  const active = (languages ?? []).find((l) => l.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="outline"
          className={cn("shadow-sm uppercase", className)}
          aria-native_name="Change language"
          title={`Language: ${active?.native_name ?? locale}`}
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
        {(languages ?? []).map((lang) => {
          const selected = lang.code === locale;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={cn("flex items-center gap-2 cursor-pointer justify-between", selected && "bg-accent")}
            >
              <span className="flex-1">{lang.native_name}</span>
              {selected && <Check className="h-4 w-4 text-green-500" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Helper
function native_nameFor(code: string, languages: Language[]) {
  return languages.find((l) => l.code === code)?.native_name ?? code;
}
