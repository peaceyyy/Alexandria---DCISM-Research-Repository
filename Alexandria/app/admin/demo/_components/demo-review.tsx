"use client";

import { useFormContext } from "react-hook-form";

import { PdfAttachmentCard } from "@/components/thesis/pdf-attachment-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { type FormValues } from "@/lib/upload/schema";
import { getResearchAreaLabel } from "@/lib/domain/research-areas";

import type { DemoTemplate } from "../_lib/fixtures";

type DemoReviewProps = {
  onGoToStep: (step: number) => void;
  template: DemoTemplate;
};

function ReviewSection({ title, step, children, onGoToStep }: {
  title: string;
  step: number;
  children: React.ReactNode;
  onGoToStep: (step: number) => void;
}) {
  return (
    <section className="space-y-3 rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-semibold">{title}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={() => onGoToStep(step)}>Edit</Button>
      </div>
      {children}
    </section>
  );
}

export function DemoReview({ onGoToStep, template }: DemoReviewProps) {
  const { getValues } = useFormContext<FormValues>();
  const values = getValues();
  const fileName = template === "thesis" ? "sample-thesis.pdf" : "sample-capstone.pdf";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Review the sample</h2>
        <p className="mt-1 text-sm text-muted-foreground">This is a presentation-only record. Viewing it will not submit or publish anything.</p>
      </div>
      <ReviewSection title="Study basics" step={1} onGoToStep={onGoToStep}>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-muted-foreground">Title</dt><dd className="font-medium">{values.title}</dd></div>
          <div><dt className="text-muted-foreground">Department</dt><dd className="font-medium">{values.department}</dd></div>
          <div><dt className="text-muted-foreground">Study type</dt><dd className="font-medium capitalize">{values.type_of_study}</dd></div>
          <div><dt className="text-muted-foreground">Publication date</dt><dd className="font-medium">{values.publication_date}</dd></div>
        </dl>
      </ReviewSection>
      <ReviewSection title="People" step={3} onGoToStep={onGoToStep}>
        <div className="space-y-3 text-sm">
          <div><p className="text-muted-foreground">Authors</p><p className="font-medium">{values.authors.filter((person) => person.contribution_role === "author").map((person) => person.display_name).join(", ")}</p></div>
          <Separator />
          <div><p className="text-muted-foreground">Advisers</p><p className="font-medium">{values.authors.filter((person) => person.contribution_role === "adviser").map((person) => person.display_name).join(", ")}</p></div>
        </div>
      </ReviewSection>
      <ReviewSection title="Abstract and insights" step={5} onGoToStep={onGoToStep}>
        <p className="whitespace-pre-wrap text-sm leading-6">{values.abstract}</p>
        <div className="flex flex-wrap gap-2">
          {values.research_areas.map((area) => <Badge key={area} variant="secondary">{getResearchAreaLabel(area)}</Badge>)}
          {values.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
        </div>
      </ReviewSection>
      <ReviewSection title="Attached document" step={6} onGoToStep={onGoToStep}>
        <PdfAttachmentCard fileName={fileName} detail="PDF document · 2.4 MB" simulated />
      </ReviewSection>
    </div>
  );
}
