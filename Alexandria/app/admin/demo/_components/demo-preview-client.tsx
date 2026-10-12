"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw } from "lucide-react";

import { PdfAttachmentCard } from "@/components/thesis/pdf-attachment-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getResearchAreaLabel } from "@/lib/domain/research-areas";
import { type FormValues } from "@/lib/upload/schema";

import { clearDemoSession, readDemoSession } from "../_lib/demo-session";
import { getDemoFixture, type DemoTemplate } from "../_lib/fixtures";
import { DemoBanner } from "./demo-banner";

function DetailBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">{label}</dt>
      <dd className="mt-1 text-sm text-[var(--color-text)]">{children}</dd>
    </div>
  );
}

function SampleRecord({ template, values }: { template: DemoTemplate; values: FormValues }) {
  const fileName = template === "thesis" ? "sample-thesis.pdf" : "sample-capstone.pdf";
  const authors = values.authors.filter((person) => person.contribution_role === "author");
  const advisers = values.authors.filter((person) => person.contribution_role === "adviser");

  return (
    <article className="rounded-xl border border-[var(--color-separator)] bg-[var(--color-surface)] shadow-sm">
      <header className="border-b border-[var(--color-separator)] px-5 py-6 sm:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-[var(--color-brand-bright)]/40 bg-[var(--color-brand-bright)]/10 text-[var(--color-brand-bright)]">Sample record</Badge>
          <Badge variant="secondary" className="capitalize">{values.type_of_study}</Badge>
          <span className="text-xs text-[var(--color-text-muted)]">Preview only · not published</span>
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-text)] sm:text-3xl">{values.title}</h1>
        <p className="mt-3 max-w-3xl leading-7 text-[var(--color-text-muted)]">{values.abstract}</p>
      </header>

      <div className="grid gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="space-y-8">
          <section>
            <h2 className="text-base font-semibold text-[var(--color-text)]">Study details</h2>
            <dl className="mt-4 grid gap-5 sm:grid-cols-2">
              <DetailBlock label="Department">{values.department}</DetailBlock>
              <DetailBlock label="Publication date">{values.publication_date}</DetailBlock>
              <DetailBlock label="Presentation">{values.conference}</DetailBlock>
              {values.deployment_link && <DetailBlock label="Sample deployment URL"><span className="break-all font-mono text-xs text-[var(--color-text-muted)]">{values.deployment_link}</span></DetailBlock>}
            </dl>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text)]">People</h2>
            <dl className="mt-4 grid gap-5 sm:grid-cols-2">
              <DetailBlock label="Authors">{authors.map((person) => person.display_name).join(", ")}</DetailBlock>
              <DetailBlock label={`Adviser${advisers.length === 1 ? "" : "s"}`}>
                {advisers.map((person) => person.display_name).join(", ")}
              </DetailBlock>
            </dl>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text)]">Research areas and tags</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {values.research_areas.map((area) => <Badge key={area} variant="secondary">{getResearchAreaLabel(area)}</Badge>)}
              {values.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text)]">Recommendations</h2>
            <p className="mt-3 leading-7 text-[var(--color-text-muted)]">{values.recommendations}</p>
            <h3 className="mt-5 text-sm font-semibold text-[var(--color-text)]">Lessons learned</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--color-text-muted)]">
              {values.lessons_learned.map((lesson) => <li key={lesson}>{lesson}</li>)}
            </ul>
          </section>
        </div>

        <aside className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Attachment preview</h2>
          <PdfAttachmentCard fileName={fileName} detail="PDF document · 2.4 MB" simulated />
        </aside>
      </div>
    </article>
  );
}

export function DemoPreviewClient({ template }: { template: DemoTemplate }) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(() => getDemoFixture(template));

  useEffect(() => {
    const sessionValues = readDemoSession(template);
    if (sessionValues) setValues(sessionValues);
  }, [template]);

  const leaveDemo = () => {
    clearDemoSession();
    router.push("/admin/dashboard");
  };

  const restart = () => {
    clearDemoSession();
    router.push(`/admin/demo/${template}`);
  };

  return (
    <main className="min-h-screen bg-[var(--color-surface-alt)] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <DemoBanner />
        <div className="mb-5 mt-7 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--color-text-muted)]">This preview is an illustrative destination after the walkthrough; it has no database record behind it.</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={leaveDemo}><ArrowLeft className="mr-2 size-4" /> Dashboard</Button>
            <Button type="button" onClick={restart}><RotateCcw className="mr-2 size-4" /> Restart demo</Button>
          </div>
        </div>
        <SampleRecord template={template} values={values} />
      </div>
    </main>
  );
}
