"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const faqItems = [
  {
    question: "Why DCISM only?",
    answer:
      "It's a proof of concept and it was an idea proposed by DCISM alumni and made by DCISM students. So starting it in such a manner would only make sense.",
  },
  {
    question: "Who can upload a thesis?",
    answer:
      "Anyone with a valid usc.edu.ph email address can create an account to contribute. However, administrators and moderators must approve submissions before they are published.",
  },
  {
    question: "Can I download the full thesis?",
    answer:
      "Yes, authenticated users can preview and download the full PDF for accepted theses. Anonymous visitors are restricted to browsing metadata and abstracts.",
  },
  {
    question: "How are related theses found?",
    answer:
      "Related theses are dynamically computed by the system on the frontend. It matches projects based on overlapping keywords, tags, and research areas.",
  },
  {
    question: "What are \"Lessons Learned\"?",
    answer:
      "Lessons learned capture practical execution guidance from previous researchers. This includes development challenges, tooling issues, and defense preparation tips.",
  },
  {
    question: "Are all submissions public?",
    answer:
      "No, only approved and published theses are visible in the repository. Drafts and archived records are hidden from the public view.",
  },
  {
    question: "How do I find specific research?",
    answer:
      "Use the search bar, then refine the results with research area, program, study type, year, and tag filters directly beneath it.",
  },
];

type FaqModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function FaqModal({ isOpen, onOpenChange }: FaqModalProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border border-[var(--color-separator-mid)] bg-[var(--color-bg)]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold">Frequently Asked Questions</DialogTitle>
          <DialogDescription className="text-sm text-[var(--color-text-muted)]">
            Everything you need to know about the Alexandria repository.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm text-[var(--color-text)]">
          {faqItems.map((item, index) => {
            const isItemOpen = openIndex === index;

            return (
              <div key={item.question} className="border-b border-[var(--color-separator)] pb-2">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isItemOpen ? null : index)}
                  className="flex w-full items-center justify-between text-left transition-colors hover:text-[var(--color-text)] opacity-90 hover:opacity-100"
                >
                  <span className="font-semibold">{item.question}</span>
                  <ChevronDown
                    size={16}
                    strokeWidth={2}
                    aria-hidden
                    className={`shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 ${
                      isItemOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isItemOpen ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 mt-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm leading-relaxed text-[var(--color-text-muted)] pb-2">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
