import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Settings, useSettings } from "@/lib/hooks/use-settings";
import { useUser } from "@/lib/hooks/use-user";
import { AiProviders } from "@/modules/ai-providers/providers";
import { AvailableAiProviders } from "@/modules/ai-providers/types/available-providers";
import { getSetupFormAndPersistedValues } from "@/modules/ai-providers/utils/get-setup-form-and-persisted-values";
import Form from "@/modules/form/components/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { open as openUrl } from "@tauri-apps/plugin-shell"
import { ExternalLinkIcon } from "lucide-react";

export function RegularProviderSetupForm({
    aiProvider,
    setAiProvider
} : {
    aiProvider: AvailableAiProviders,
    setAiProvider: React.Dispatch<React.SetStateAction<AvailableAiProviders>>
}) {
    const { user } = useUser();
    const { toast } = useToast();
    const { settings, updateSettings } = useSettings()

    const { data } = useQuery({
        queryKey: ['setupForm', aiProvider],
        queryFn: async () => {
            const result = await getSetupFormAndPersistedValues({
            activeAiProvider: settings.aiProviderType,
            selectedAiProvider: aiProvider,
            settings
            })
            return result
        }
    })
    
    const { 
        mutateAsync: updateSettingsAsync, 
        isPending: updateSettingsAsyncPending
    } = useMutation({
        mutationFn: async (values: Partial<Settings>) => {
          try {
            updateSettings({
              ...values
            });
          } catch (e: any) {
            throw new Error(e.message)
          }
        },
        onSuccess: () => {
          toast({
            title: "ai provider info updated",
          });
        }, 
        onError: (e) => {
          toast({
            title: "ai provider update failed!",
            description: e.message ? e.message : 'please try again.',
            variant: 'destructive'
          });
        }
    })
    
    const { 
        mutateAsync: credentialValidation, 
        isPending:  credentialValidationPending
    } = useMutation({
        mutationFn: async (values: Partial<Settings>) => {
          try {
            if (AiProviders[aiProvider].credentialValidation) {
              await AiProviders[aiProvider].credentialValidation(values)
            }
          } catch (e: any) {
            throw new Error(e.message)
          }
        },
        onSuccess: () => {
          toast({
            title: "credential validation successful",
          });
        }, 
        onError: (e) => {
          toast({
            title: "credential validation failed!",
            description: e.message ? e.message : 'please try again.',
            variant: 'destructive'
          });
        }
    })
    
    const componentsVisibility = useMemo(() => {
        if (aiProvider === AvailableAiProviders.SCREENPIPE_CLOUD && !user) {
          return {showForm: false, showLoginStep: true}
        }
    
        return {showForm: true}
    },[aiProvider, user])
    
    async function submitChanges(values: Partial<Settings>) {
      if (aiProvider !== AvailableAiProviders.EMBEDDED) {
        await credentialValidation(values)
        await updateSettingsAsync({
          ...values, 
          aiProviderType: aiProvider
        })
      } else {
        await updateSettingsAsync({
          embeddedLLM: {
            ...values as any
          }
        })
      }
    }

    return (
        <>
            {componentsVisibility.showLoginStep && (
                <div className="w-full flex flex-col items-center space-y-3">
                <h1>
                    please login to your screenpipe account to continue
                </h1>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openUrl("https://screenpi.pe/login")}
                    className="hover:bg-secondary/80"
                >
                    login <ExternalLinkIcon className="w-4 h-4 ml-2" />
                </Button>
                </div>
            )}
            
            {(data?.setupForm && componentsVisibility.showForm) &&
              <Form
                isDirty={!(aiProvider === settings.aiProviderType)}
                defaultValues={data.defaultValues}
                isLoading={updateSettingsAsyncPending || credentialValidationPending}
                onSubmit={submitChanges}
                onReset={async () => setAiProvider(settings.aiProviderType)}
                key={aiProvider}
                form={data.setupForm}
              />
            }
        </>
    )
}