import { Label } from "@/components/ui/label";
import { TooltipDefault } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { Settings, useSettings } from "@/lib/hooks/use-settings";
import { AvailableAiProviders } from "@/modules/ai-providers/types/available-providers";
import { getSetupFormAndPersistedValues } from "@/modules/ai-providers/utils/get-setup-form-and-persisted-values";
import Form from "@/modules/form/components/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { StatusDisplay } from "./status-display";
import { LLMLogFiles } from "./log-files";
import {  ModelState } from "@/modules/ai-providers/providers/embedded/provider-metadata";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { useLLM } from "./context";
import { InstructionsBanner } from "./instructions-banner";
import { Eraser, EyeOff, Pause, Play, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidecarState } from '../../../../ai-providers/providers/embedded/provider-metadata';
import { useForm } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { getOllamaModels } from "@/modules/ai-providers/providers/native-llama/utils";
import Select from "@/components/select";

export function EmbeddedControlCenter({
    aiProvider,
    setAiProvider
} : {
    aiProvider: AvailableAiProviders,
    setAiProvider: React.Dispatch<React.SetStateAction<AvailableAiProviders>>
}) {
    return (
      <div className="flex flex-col space-y-3">
        <InstructionsBanner/>
        <SidecarController/>
        <ModelController/>
        <LLMLogFiles/>
       </div>
    )
}

function SidecarController() {
  const { settings, updateSettings } = useSettings()
  const { sidecarStatus, handleSidecarAction } = useLLM()
  
  const form = useForm({
    defaultValues: {
      port: settings.embeddedLLM.port.toString()
    }
  })

  const isPlayButtonDisabled = useMemo(() => {
    if (sidecarStatus === SidecarState.ACTIVE || sidecarStatus === SidecarState.UNKNOWN || form.formState.isDirty) {
      return true
    }

    return false
  }, [sidecarStatus, form.formState.isDirty])

  const isPauseButtonDisabled = useMemo(() => {
    if (sidecarStatus !== SidecarState.ACTIVE) {
      return true
    }

    return false
  }, [sidecarStatus])

  const { 
    mutateAsync: updateSettingsAsync, 
    isPending: updateSettingsAsyncPending
  } = useMutation({
      mutationFn: async (values: Partial<Settings>) => {
        updateSettings({
          ...values
        });
      },
      onSuccess: () => {
        toast({
          title: "sidecar default port updated",
        });
      }, 
      onError: (e) => {
        toast({
          title: "form submission failed!",
          description: e.message ? e.message : 'please try again.',
          variant: 'destructive'
        });
      }
  })

  async function handleFormSubmit(values: { port: string }) {
    await updateSettingsAsync({
      embeddedLLM: {
        port: parseInt(values.port, 10),
        model: settings.embeddedLLM.model,
        enabled: true
      }
    })

    form.reset({
      port: values.port
    })
  }

  function resetForm() {
    form.reset()
  }

  const tooltipTexts = {
    [SidecarState.INACTIVE]: 'screenpipe\'s sidecar is currently not running',
    [SidecarState.ERROR]: 'there was an issue while running the sidecar',
    [SidecarState.ACTIVE]: `sidecar is currently exposed at port: ${settings.embeddedLLM.port}`,
    [SidecarState.UNKNOWN]: 'we\'re checking sidecar status'
  }

  return (
        <div className="border rounded-md flex flex-col space-y-4 p-4">
          <div className="flex flex-col justify-between w-full space-y-1">
            <Label>
              sidecar control center
            </Label>
            <p className="text-xs text-muted-foreground">
              control and find useful information about screenpipe's ai sidecar
            </p>
          </div>
          <div className="flex space-x-3">
            <StatusDisplay 
              status={sidecarStatus}
              text={tooltipTexts[sidecarStatus]}
            />
            <form 
              className="w-[70%]"
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
      
                form
                  .handleSubmit(handleFormSubmit)(event)
              }}
            >
              <div className="border rounded-md relative flex items-center">
                <div className="px-4 border-r opacity-50">
                  port:
                </div>
                <FormField
                  key={'port'}
                  name={'port'}
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <Input
                        {...field}
                        className="pr-10 border-0"
                        autoCorrect="off"
                        autoCapitalize="off"
                        autoComplete="off"
                      />
                    )
                  }}
                />
                {form.formState.isDirty && (
                  <div className="absolute right-0 flex justify-center">
                    <TooltipDefault
                      text={'erase changes'}
                    > 
                      <button 
                        type="button"
                        className="h-10 w-10 flex justify-center items-center hover:cursor-pointer"
                        onClick={resetForm}
                      >
                        <Eraser className="w-4 h-4"/>
                      </button>
                    </TooltipDefault>
                    <TooltipDefault
                      text={'save changes'}
                    > 
                      <button className="h-10 w-10 flex justify-center items-center hover:cursor-pointer">
                        <Save className="w-4 h-4"/>
                      </button>
                    </TooltipDefault>
                  </div>
                )}
              </div>
            </form>
            <TooltipDefault
              text={'initiate screenpipe\'s sidecar'}
            > 
              <Button
                variant={'outline'}
                size={'icon'} 
                className="w-[10%]"
                disabled={isPlayButtonDisabled}
                onClick={handleSidecarAction}
              >
                <Play/>
              </Button>
            </TooltipDefault>
            <TooltipDefault
              text={'stop screenpipe\'s sidecar'}
            > 
              <Button 
                variant={'outline'}
                size={'icon'} 
                className="w-[10%]"
                disabled={isPauseButtonDisabled}
                onClick={handleSidecarAction}
              >
                <Pause/>
              </Button>
            </TooltipDefault>
          </div>
        </div>
  )
}

function ModelController() {
  const { settings } = useSettings()
  const { sidecarStatus, modelStatus, handleModelAction } = useLLM()
  
  const {data: availableModels} = useQuery({
    queryKey: ['sidecar', 'models'],
    queryFn: async () => await getOllamaModels(settings.embeddedLLM.port.toString()),
    enabled: sidecarStatus === SidecarState.ACTIVE
  })

  const selectDisabled = useMemo(() => {
    if (sidecarStatus !== SidecarState.ACTIVE) {
      return true
    }

    return false
  }, [sidecarStatus])

  const playButtonDisabled = useMemo(() => {
    if (sidecarStatus !== SidecarState.ACTIVE) {
      return true
    }

    if (modelStatus === ModelState.RUNNING || modelStatus === ModelState.ERROR) {
      return true
    }

    return false
  }, [sidecarStatus, modelStatus])

  const pauseButtonDisabled = useMemo(() => {
    if (sidecarStatus !== SidecarState.ACTIVE) {
      return true
    }

    if (modelStatus !== ModelState.RUNNING) {
      return true
    }

    return false
  }, [sidecarStatus, modelStatus])

  const form = useForm({
    defaultValues: {
      model: settings.embeddedLLM.model
    }
  })

  const tooltipTexts = {
    [ModelState.INACTIVE]: 'no model is currently running',
    [ModelState.ERROR]: 'there was an issue while running the model',
    [ModelState.RUNNING]: `${settings.embeddedLLM.model} is currently running`,
    [ModelState.UNKNOWN]: 'we\'re checking model status'
  }

  return (
    <div className="border rounded-md relative">
      <div className="w-full h-full flex flex-col space-y-4  p-4">
        <div className="flex flex-col justify-between w-full space-y-1">
          <Label>
            embedded llm control center
          </Label>
          <p className="text-xs text-muted-foreground">
            control and find useful information about the model running in screenpipe's sidecar
          </p>
        </div>
        <div className="flex space-x-3">
          <StatusDisplay
            text={tooltipTexts[modelStatus]}
            status={modelStatus}
          />
          <div className="border rounded-md w-[70%] relative flex items-center">
              <div className="px-4 border-r opacity-50">
                model:
              </div>
              <FormField
                key={'model'}
                name={'model'}
                control={form.control}
                render={({ field }) => {
                    const generatedOptions = useMemo(() => {
                      return availableModels?.map((option) => {
                        return {
                          value: option, 
                          label: option
                        }
                      })
                    },[availableModels])

                    return (
                      <Select
                        isDisabled={selectDisabled}
                        isCreateable
                        className="w-[100%] !border-none"
                        options={generatedOptions}
                        {...field}
                        onChange={(e) => field.onChange(e?.value)}
                        value={field.value ? {value: field.value, label: field.value} : undefined}
                      />
                    )
                }}
              />
          </div>
          <TooltipDefault
            text='click to start model'
          >
            <Button
              variant={'outline'}
              size={'icon'} 
              className="w-[10%]"
              onClick={handleModelAction}
              disabled={playButtonDisabled}
            >
              <Play/>
            </Button>
          </TooltipDefault>
          <TooltipDefault
            text='click to stop model'
          >
            <Button 
              variant={'outline'}
              size={'icon'} 
              className="w-[10%]"
              onClick={handleModelAction}
              disabled={pauseButtonDisabled}
            >
              <Pause/>
            </Button>
          </TooltipDefault>
        </div>
      </div>
    </div>
  )
}

function EmbeddedSetupForm({
  aiProvider,
} : {
  aiProvider: AvailableAiProviders,
}) {
  const { settings, updateSettings } = useSettings()

  const { data } = useQuery({
    queryKey: ['setupForm', AvailableAiProviders.EMBEDDED],
    queryFn: async () => {
        const result = await getSetupFormAndPersistedValues({
          activeAiProvider: settings.aiProviderType,
          selectedAiProvider: AvailableAiProviders.EMBEDDED,
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
        updateSettings({
          ...values
        });
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

  async function submitChanges(values: {port: string}) {
    await updateSettingsAsync({
      embeddedLLM: {
        port: parseInt(values.port, 10),
        model: settings.embeddedLLM.model,
        enabled: true
      }
    })
  }

  return (
    <>
      {data?.setupForm &&
          <Form
            controlledShowSubmitButton={false}
            defaultValues={data.defaultValues}
            isLoading={updateSettingsAsyncPending}
            onSubmit={submitChanges}
            key={aiProvider}
            form={data.setupForm}
          />
      }
    </>
  )
}