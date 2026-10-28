// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Stepper } from "./stepper";

const steps = [
  { id: 1, label: "Basics" },
  { id: 2, label: "Publication" },
  { id: 3, label: "People" },
] as const;

describe("Stepper", () => {
  it("uses explicit field-valid completion instead of marking every earlier step complete", () => {
    render(
      <Stepper
        steps={steps}
        currentStep={3}
        completedSteps={[1]}
        onStepClick={() => undefined}
      />,
    );

    expect(screen.getByRole("button", { name: /basics.*completed/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /publication$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /people/i })).toHaveAttribute("aria-current", "step");
  });
});
