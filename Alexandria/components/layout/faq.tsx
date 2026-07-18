"use client";

import { useState } from "react";

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
      "You can search for titles, author names, or keywords using the search bar. You can also use the sidebar to filter results by research area, department, and year.",
  },
];

export default function FaqRail() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <aside className="px-4 py-5 lg:px-6">
      <div className="rounded-lg border border-[var(--color-separator-mid)] p-4">
        <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
          Frequently Asked Questions (FAQ)
        </h3>

        <div className="space-y-3 text-sm text-[var(--color-text)]">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={item.question} className="border-b border-[var(--color-separator)] pb-2">
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between text-left"
                >
                  <span>{item.question}</span>
                  <span>{isOpen ? "−" : "⌄"}</span>
                </button>

                <div
                    className={`grid transition-all duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 mt-0"
                    }`}
                    >
                    <div className="overflow-hidden">
                        <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                        {item.answer}
                        </p>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}