import React, { createContext, useContext, SetStateAction, Dispatch } from "react";
import { useOnboardingVisibility } from "./hooks/use-onboarding-visibility";
import { useOnboardingUserInput } from "./hooks/use-onboarding-user-input";
import { useOnboardingFlow } from "./hooks/use-onboarding-flow";
import { SlideKey } from "./flow";

interface OnboardingContextType {
  showOnboarding: boolean;
  selectedOptions: string[];
  selectedPersonalization: string | null;
  selectedPreference: string | null;
  setSelectedOptions: Dispatch<SetStateAction<string[]>>;
  setSelectedPersonalization: Dispatch<SetStateAction<string | null>>;
  setSelectedPreference: Dispatch<SetStateAction<string | null>>;
  setShowOnboardingToFalse: () => void,
  setShowOnboardingToTrue: () => void,
  currentSlide: SlideKey;
  error: string | null;
  handleNextSlide: () => void;
  handlePrevSlide: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  handleEnd: () => Promise<void>;
  setRestartPending: () => Promise<void>;
} 

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { 
    selectedOptions, 
    setSelectedOptions, 
    selectedPersonalization, 
    setSelectedPersonalization, 
    selectedPreference, 
    setSelectedPreference 
  } = useOnboardingUserInput();

  const { 
    showOnboarding, 
    setShowOnboardingToFalse, 
    setShowOnboardingToTrue,
    skipOnboarding,
    completeOnboarding,
    handleEnd,
    restartPending
  } = useOnboardingVisibility(
    selectedOptions,
    selectedPreference,
    selectedPersonalization,
  );

  const { 
    currentSlide, 
    error, 
    handleNextSlide, 
    handlePrevSlide,
    setRestartPending
  } = useOnboardingFlow(
    restartPending,
    selectedOptions,
    selectedPreference,
    selectedPersonalization,
  );

  return (
    <OnboardingContext.Provider value={{ 
        showOnboarding,
        selectedOptions,
        selectedPersonalization,
        selectedPreference,
        setSelectedOptions,
        setSelectedPersonalization,
        setSelectedPreference,
        setShowOnboardingToFalse,
        setShowOnboardingToTrue,
        currentSlide,
        error,
        handleNextSlide,
        handlePrevSlide,
        skipOnboarding,
        completeOnboarding,
        handleEnd,
        setRestartPending
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};

