"use client";
import { useSettings } from "@/lib/hooks/use-settings";
import React, { useEffect } from "react";
import NotificationHandler from "@/components/notification-handler";
import Header from "@/components/header";
import { usePostHog } from "posthog-js/react";
import { useToast } from "@/components/ui/use-toast";
import Onboarding from "@/components/onboarding";
import { useOnboarding } from "@/lib/hooks/use-onboarding";
import { registerShortcuts } from "@/lib/shortcuts";
import { ChangelogDialog } from "@/components/changelog-dialog";
import { platform } from "@tauri-apps/plugin-os";
import PipeStore from "@/components/pipe-store";
import { OnboardingFlowProvider } from "@/components/onboarding/context/onboarding-context";

export default function Home() {
  const { settings } = useSettings();
  const posthog = usePostHog();
  const { toast } = useToast();
  const { showOnboarding, setShowOnboarding } = useOnboarding();

  useEffect(() => {
    registerShortcuts({
      showScreenpipeShortcut: settings.showScreenpipeShortcut,
      disabledShortcuts: settings.disabledShortcuts,
    });
  }, [settings.showScreenpipeShortcut, settings.disabledShortcuts]);

  useEffect(() => {
    if (settings.userId) {
      posthog?.identify(settings.userId, {
        os: platform(),
      });
    }
  }, [settings.userId, posthog]);

  return (
    <div className="flex flex-col items-center flex-1">
      <NotificationHandler />
      {showOnboarding && 
        <OnboardingFlowProvider>
          <Onboarding />
        </OnboardingFlowProvider>
      }
      <ChangelogDialog />
      <Header />
      <div className="h-[32px]"/>
      <div className=" w-[90%]">
        <PipeStore />
      </div>
    </div>
  );
}
