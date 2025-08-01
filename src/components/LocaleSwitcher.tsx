"use client";

import { useLocale, useTranslations } from "next-intl";
import { Language, SUPPORTED_LOCALES } from "@/lib/constants/language";
import { useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const LocaleSwitcher = () => {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale() as Language;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const languageOptions: Record<Language, { label: string; flag: string }> = {
    en: { label: t("english"), flag: "/flags/en.svg" },
    tr: { label: t("turkish"), flag: "/flags/tr.svg" },
  };

  const changeLanguage = (newLocale: Language) => {
    if (newLocale === locale) return setIsOpen(false);

    setIsChanging(true);

    setTimeout(() => {
      const segments = pathname.split("/");
      if (SUPPORTED_LOCALES.includes(segments[1] as Language)) {
        segments[1] = newLocale;
      } else {
        segments.splice(1, 0, newLocale);
      }
      const newPath = segments.join("/") || "/";
      router.replace(newPath);
      setIsChanging(false);
      setIsOpen(false);
    }, 300);
  };

  return (
    <div className='relative w-[150px]'>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='w-full justify-between px-3 py-5'
            aria-label={t("changeLanguage")}
          >
            <div className='flex items-center gap-2'>
              <Image
                src={languageOptions[locale].flag}
                alt={locale}
                width={20}
                height={20}
              />
              <span className='font-medium'>
                {languageOptions[locale].label}
              </span>
            </div>
            <ChevronDownIcon
              className={`ml-2 h-4 w-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </DropdownMenuTrigger>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DropdownMenuContent
                align='end'
                className='w-[var(--radix-dropdown-menu-trigger-width)]'
                onInteractOutside={() => setIsOpen(false)}
              >
                <DropdownMenuLabel className='px-4 py-2 text-xs text-muted-foreground'>
                  {t("selectLanguage")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {SUPPORTED_LOCALES.map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`px-4 py-3 cursor-pointer ${
                      locale === lang ? "bg-accent" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className='flex items-center justify-between w-full'>
                      <div className='flex items-center gap-3'>
                        <Image
                          src={languageOptions[lang].flag}
                          alt={lang}
                          width={20}
                          height={20}
                        />
                        <span>{languageOptions[lang].label}</span>
                      </div>
                      {locale === lang && (
                        <CheckIcon className='h-4 w-4 text-primary' />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </motion.div>
          )}
        </AnimatePresence>
      </DropdownMenu>

      <AnimatePresence>
        {isChanging && (
          <motion.div
            className='absolute inset-0 bg-background/70 flex items-center justify-center rounded-md'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <Image
                src={languageOptions[locale].flag}
                alt='Loading flag'
                width={32}
                height={32}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocaleSwitcher;
