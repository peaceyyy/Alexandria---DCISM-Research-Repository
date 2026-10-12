"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { formSchema, type FormValues, STEPS } from "@/lib/upload/schema";
import { Stepper } from "@/app/upload/_components/stepper";
import { useStepCompletion } from "@/app/upload/_components/use-step-completion";
import { UploadHeader } from "@/app/upload/_components/upload-header";
import { StepStudyBasics } from "@/app/upload/_components/steps/step-study-basics";
import { StepPublication } from "@/app/upload/_components/steps/step-publication";
import { StepPeople } from "@/app/upload/_components/steps/step-people";
import { StepContent } from "@/app/upload/_components/steps/step-content";
import { StepInsights } from "@/app/upload/_components/steps/step-insights";

import { writeDemoSession } from "../_lib/demo-session";
import { getDemoFixture, type DemoTemplate } from "../_lib/fixtures";
import { DemoBanner } from "./demo-banner";
import { DemoReview } from "./demo-review";
import { SimulatedPdfCard } from "./simulated-pdf-card";

type DemoWizardProps = { template: DemoTemplate };

export function DemoWizard({ template }: DemoWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [errorSteps, setErrorSteps] = useState<number[]>([]);
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDemoFixture(template),
    mode: "onTouched",
  });
  const { formState, trigger, getValues } = methods;
  const { completedSteps, validateStep } = useStepCompletion({
    methods,
    initialCompletedSteps: STEPS.slice(0, -1).map(({ id }) => id),
  });

  useEffect(() => {
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!formState.isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [formState.isDirty]);

  const goToStep = (nextStep: number) => setCurrentStep(nextStep);

  const continueToNextStep = async () => {
    const isValid = await validateStep(currentStep, { shouldFocus: true });
    if (isValid) {
      setErrorSteps((steps) => steps.filter((step) => step !== currentStep));
      goToStep(currentStep + 1);
    } else {
      setErrorSteps((steps) => Array.from(new Set([...steps, currentStep])));
    }
  };

  const handleStepClick = async (step: number) => {
    if (step === currentStep) return;
    await validateStep(currentStep);
    goToStep(step);
  };

  const viewSampleRecord = async () => {
    const isValid = await trigger();
    if (!isValid) {
      setErrorSteps(STEPS.map(({ id }) => id).filter((step) => step < 6));
      return;
    }
    writeDemoSession(template, getValues());
    router.push(`/admin/demo/${template}/preview`);
  };

  const content = {
    1: <StepStudyBasics />,
    2: <StepPublication />,
    3: <StepPeople />,
    4: <StepContent />,
    5: <StepInsights />,
    6: <SimulatedPdfCard template={template} />,
    7: <DemoReview template={template} onGoToStep={setCurrentStep} />,
  } as const;

  return (
    <FormProvider {...methods}>
      <div className="flex h-[100dvh] min-h-screen flex-col overflow-hidden bg-[var(--color-bg)]">
        <UploadHeader showBrand={false} />
        <DemoBanner className="top-[4rem] sm:top-[4.5rem]" />
        <div className="shrink-0 border-b border-[var(--color-separator)] px-4">
          <div className="mx-auto max-w-5xl">
            <Stepper
              steps={STEPS}
              currentStep={currentStep}
              completedSteps={completedSteps}
              errorSteps={errorSteps}
              onStepClick={handleStepClick}
            />
          </div>
        </div>
        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-6">
          <div className="mx-auto w-full max-w-[540px]">
            {content[currentStep]}
          </div>
        </main>
        <footer className="shrink-0 border-t border-[var(--color-separator-mid)] bg-[var(--color-bg)]/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-[540px] items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <Button type="button" variant="outline" onClick={() => goToStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}>
              <ChevronLeft className="mr-2 size-4" /> Back
            </Button>
            {currentStep === 7 ? (
              <Button type="button" onClick={viewSampleRecord}><Eye className="mr-2 size-4" /> View sample record</Button>
            ) : (
              <Button type="button" onClick={continueToNextStep}>Next <ChevronRight className="ml-2 size-4" /></Button>
            )}
          </div>
        </footer>
      </div>
    </FormProvider>
  );
}
