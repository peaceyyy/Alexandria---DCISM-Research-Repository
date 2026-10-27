import type { FormValues } from "@/lib/upload/schema";

export type DemoTemplate = "thesis" | "capstone";

const DEMO_FIXTURES: Record<DemoTemplate, FormValues> = {
  thesis: {
    title: "Title of Sample Thesis",
    abstract:
      "Description of the sample thesis. This fictional content demonstrates where an approved abstract would appear.",
    department: "CS",
    type_of_study: "thesis",
    research_areas: ["web_development", "algorithms"],
    authors: [
      {
        user_id: null,
        display_name: "Sample Author 1",
        contribution_role: "author",
        sort_order: 1,
      },
      {
        user_id: null,
        display_name: "Sample Adviser",
        contribution_role: "adviser",
        sort_order: 2,
      },
    ],
    tags: ["sample tag 1", "sample tag 2"],
    publication_date: "2025-06-13",
    publication_link: "https://example.invalid/sample-thesis",
    deployment_link: "",
    conference: "Sample Research Presentation",
    recommendations:
      "Sample recommendation text for presentation purposes only.",
    lessons_learned: [
      "Sample lesson one.",
      "Sample lesson two.",
    ],
  },
  capstone: {
    title: "Title of Sample Capstone",
    abstract:
      "Description of the sample capstone. This fictional content demonstrates where a project overview would appear.",
    department: "IT",
    type_of_study: "capstone",
    research_areas: ["web_development"],
    authors: [
      {
        user_id: null,
        display_name: "Sample Capstone Author 1",
        contribution_role: "author",
        sort_order: 1,
      },
      {
        user_id: null,
        display_name: "Sample Capstone Adviser",
        contribution_role: "adviser",
        sort_order: 2,
      },
    ],
    tags: ["sample tag 1", "sample capstone"],
    publication_date: "2025-06-13",
    publication_link: "https://example.invalid/sample-capstone",
    deployment_link: "https://example.invalid/sample-capstone-app",
    conference: "Sample Capstone Presentation",
    recommendations:
      "Sample recommendation text for presentation purposes only.",
    lessons_learned: [
      "Sample capstone lesson one.",
      "Sample capstone lesson two.",
    ],
  },
};

export function getDemoFixture(template: DemoTemplate): FormValues {
  return structuredClone(DEMO_FIXTURES[template]);
}
