"use client";

import { useCallback, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { FIELD_STEP_MAP, type FormValues, STEPS } from "@/lib/upload/schema";

type ValidateStepOptions = {
  shouldFocus?: boolean;
};

type UseStepCompletionOptions = {
  methods: UseFormReturn<FormValues>;
  initialCompletedSteps?: number[];
  isSupplementalStepComplete?: (step: number) => boolean;
};

function getStepFields(step: number) {
  return Object.entries(FIELD_STEP_MAP)
    .filter(([, fieldStep]) => fieldStep === step)
    .map(([field]) => field as keyof FormValues);
}

export function useStepCompletion({
  methods,
  initialCompletedSteps = [],
  isSupplementalStepComplete,
}: UseStepCompletionOptions) {
  const [completedSteps, setCompletedSteps] = useState(initialCompletedSteps);

  const validateStep = useCallback(
    async (step: number, { shouldFocus = false }: ValidateStepOptions = {}) => {
      if (step >= STEPS.length) return true;

      const fields = getStepFields(step);
      const fieldsAreValid = fields.length
        ? await methods.trigger(fields, { shouldFocus })
        : true;
      const isComplete = fieldsAreValid && (isSupplementalStepComplete?.(step) ?? true);

      setCompletedSteps((previous) =>
        isComplete
          ? Array.from(new Set([...previous, step]))
          : previous.filter((completedStep) => completedStep !== step),
      );

      return isComplete;
    },
    [isSupplementalStepComplete, methods],
  );

  const markStepIncomplete = useCallback((step: number) => {
    setCompletedSteps((previous) => previous.filter((completedStep) => completedStep !== step));
  }, []);

  return { completedSteps, markStepIncomplete, validateStep };
}
