"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import type { PropsWithChildren } from "react";
import { getUserTimeZone } from "@/lib/utils";

interface Props extends PropsWithChildren {
  locale: string;
  messages: Record<string, unknown>;
}

export function Providers({ children, locale, messages }: Props) {
  const [queryClient] = useState(() => new QueryClient());
  const [timeZone, setTimeZone] = useState("UTC");

  useEffect(() => {
    setTimeZone(getUserTimeZone());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone={timeZone}
      >
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
}
