"use client";

import { StepWrapper } from "@/app/upload/_components/steps/_helpers";
import { PdfAttachmentCard } from "@/components/thesis/pdf-attachment-card";

export function SimulatedPdfCard({ template }: { template: "thesis" | "capstone" }) {
  const fileName = template === "thesis" ? "sample-thesis.pdf" : "sample-capstone.pdf";

  return (
    <StepWrapper
      title="Submission materials"
      description="This walkthrough shows how the required PDF attachment is presented. No document is uploaded in presentation mode."
    >
      <section aria-labelledby="sample-pdf-heading">
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <div>
            <h3 id="sample-pdf-heading" className="text-sm font-semibold text-[var(--color-text)]">
              Thesis PDF
            </h3>
            <p className="mt-1 text-sm leading-5 text-[var(--color-text-muted)]">
              A real submission requires one PDF. This demo uses an illustrative attachment only.
            </p>
          </div>
          <span className="shrink-0 text-xs font-semibold text-[var(--color-brand)]">Simulated</span>
        </div>
        <PdfAttachmentCard
          fileName={fileName}
          detail="PDF document · 2.4 MB"
          simulated
        />
      </section>
    </StepWrapper>
  );
}
