// app/providers.tsx
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { initOpenTelemetry } from "@/lib/opentelemetry";
import { OnboardingProvider } from "@/lib/hooks/use-onboarding";
import { ChangelogDialogProvider } from "@/lib/hooks/use-changelog-dialog";
import { forwardRef } from "react";
import { store as SettingsStore } from "@/lib/hooks/use-settings";
import { profilesStore as ProfilesStore } from "@/lib/hooks/use-profiles";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) =>
      //TODOO: TOAST
      console.error(`${query.meta?.errorMessage} ${error.message}`),
  }),
})

export const Providers = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children }, ref) => {
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const isDebug = process.env.TAURI_ENV_DEBUG === "true";
  //     if (isDebug) return;
  //     posthog.init("phc_Bt8GoTBPgkCpDrbaIZzJIEYt0CrJjhBiuLaBck1clce", {
  //       api_host: "https://eu.i.posthog.com",
  //       person_profiles: "identified_only",
  //       capture_pageview: false,
  //     });
  //     initOpenTelemetry("82688", new Date().toISOString());
  //   }
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsStore.Provider>
        <ProfilesStore.Provider>
          <OnboardingProvider>
            <ChangelogDialogProvider>
              <PostHogProvider client={posthog}>{children}</PostHogProvider>
            </ChangelogDialogProvider>
          </OnboardingProvider>
        </ProfilesStore.Provider>
      </SettingsStore.Provider>
    </QueryClientProvider>
  );
});

Providers.displayName = "Providers";
