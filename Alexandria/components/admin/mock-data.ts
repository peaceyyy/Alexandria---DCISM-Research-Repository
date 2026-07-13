import type { ReviewStatus } from "@/lib/services/types";
import type { ReviewComment, ReviewAuditEvent, ReviewSubmission } from "@/components/review/types";

// ============================================================
// Mock data for the Admin Review pages (no backend binding yet).
//
// All shapes in MockReviewSubmission mirror the ReviewSubmission
// interface from @/components/review/types.ts — swap mock arrays
// for real API responses with minimal friction when backend is ready.
// ============================================================

// ─── Legacy types kept for other admin pages ──────────────────────────────────

export type UploadStatus = "Pending" | "Approved" | "Flagged";
type ActiveReviewStatus = Exclude<ReviewStatus, "trashed">;

export const REVIEW_STATUS_TO_UPLOAD_STATUS: Record<
  ActiveReviewStatus,
  UploadStatus
> = {
  for_review: "Pending",
  accepted: "Approved",
  flagged: "Flagged",
};

export const UPLOAD_STATUS_TO_REVIEW_STATUS: Record<
  UploadStatus,
  ActiveReviewStatus
> = {
  Pending: "for_review",
  Approved: "accepted",
  Flagged: "flagged",
};

export type Affiliation = "Student" | "Alumni" | "Professor";

export interface MockUpload {
  id: number;
  title: string;
  author: string;
  dateCreated: string;
  status: UploadStatus;
}

export interface MockMember {
  id: number;
  name: string;
  email: string;
  affiliation: Affiliation;
}

export interface MockModerator {
  id: number;
  name: string;
  email: string;
}

// ─── Review Submission (API-ready shape) ──────────────────────────────────────

/**
 * MockReviewSubmission extends ReviewSubmission with no extra fields.
 * This alias exists so other components that import from mock-data can continue
 * to reference MockReviewSubmission while we migrate to the real API shape.
 */
export type MockReviewSubmission = ReviewSubmission;

// ─── Mock Field Comments ──────────────────────────────────────────────────────

const mockComments: ReviewComment[] = [
  {
    id: 1,
    thesisId: 1,
    fieldKey: "abstract",
    comment:
      "Please verify the methodology and confirm the dataset was properly cited.",
    createdByUserId: "mod-user-1",
    createdByName: "Anna Reyes",
    createdAt: "2026-06-25T08:30:00Z",
    resolvedAt: null,
  },
  {
    id: 2,
    thesisId: 1,
    fieldKey: "abstract",
    comment:
      "The literature review is strong, but the evaluation section needs more detail.",
    createdByUserId: "mod-user-1",
    createdByName: "Anna Reyes",
    createdAt: "2026-06-25T09:15:00Z",
    resolvedAt: null,
  },
  {
    id: 3,
    thesisId: 1,
    fieldKey: "authors",
    comment:
      "Please confirm all co-authors are listed with their correct affiliations.",
    createdByUserId: "mod-user-1",
    createdByName: "Anna Reyes",
    createdAt: "2026-06-25T09:20:00Z",
    resolvedAt: null,
  },
  {
    id: 4,
    thesisId: 1,
    fieldKey: "pdf_general",
    comment:
      "The appendix figures are low resolution. Resubmit with 300 DPI or higher.",
    createdByUserId: "mod-user-1",
    createdByName: "Anna Reyes",
    createdAt: "2026-06-25T10:05:00Z",
    resolvedAt: null,
  },
  {
    id: 5,
    thesisId: 3,
    fieldKey: "lessons_learned",
    comment:
      "Needs a more detailed implementation section with reproducible steps.",
    createdByUserId: "mod-user-2",
    createdByName: "Johnny Doe",
    createdAt: "2026-06-14T14:22:00Z",
    resolvedAt: null,
  },
  {
    id: 6,
    thesisId: 4,
    fieldKey: "abstract",
    comment:
      "Please check whether the evaluation metrics are clearly explained.",
    createdByUserId: "mod-user-1",
    createdByName: "Anna Reyes",
    createdAt: "2026-06-08T11:00:00Z",
    resolvedAt: null,
  },
];

// ─── Mock Audit Events ────────────────────────────────────────────────────────

const mockAuditEvents: ReviewAuditEvent[] = [
  {
    id: 1,
    thesisId: 1,
    event: "submitted",
    description: "Submission received for review.",
    createdByName: "System",
    createdAt: "2026-06-25T07:50:00Z",
  },
  {
    id: 2,
    thesisId: 1,
    event: "comment_added",
    description: "Moderator added feedback on Authors.",
    createdByName: "Anna Reyes",
    createdAt: "2026-06-25T09:20:00Z",
  },
  {
    id: 3,
    thesisId: 1,
    event: "comment_added",
    description: "Moderator added feedback on Abstract.",
    createdByName: "Anna Reyes",
    createdAt: "2026-06-25T09:15:00Z",
  },
  {
    id: 4,
    thesisId: 1,
    event: "comment_added",
    description: "Moderator added feedback on PDF / Paper.",
    createdByName: "Anna Reyes",
    createdAt: "2026-06-25T10:05:00Z",
  },
  {
    id: 5,
    thesisId: 3,
    event: "submitted",
    description: "Submission received for review.",
    createdByName: "System",
    createdAt: "2026-06-14T13:00:00Z",
  },
  {
    id: 6,
    thesisId: 3,
    event: "comment_added",
    description: "Moderator added feedback on Lessons Learned.",
    createdByName: "Johnny Doe",
    createdAt: "2026-06-14T14:22:00Z",
  },
  {
    id: 7,
    thesisId: 4,
    event: "submitted",
    description: "Submission received for review.",
    createdByName: "System",
    createdAt: "2026-06-08T10:00:00Z",
  },
  {
    id: 8,
    thesisId: 4,
    event: "status_changed",
    description: "Submission flagged for member revision.",
    createdByName: "Anna Reyes",
    createdAt: "2026-06-08T11:30:00Z",
  },
  {
    id: 9,
    thesisId: 2,
    event: "submitted",
    description: "Submission received for review.",
    createdByName: "System",
    createdAt: "2026-06-20T09:00:00Z",
  },
  {
    id: 10,
    thesisId: 2,
    event: "status_changed",
    description: "Submission approved for publication.",
    createdByName: "Johnny Doe",
    createdAt: "2026-06-21T10:00:00Z",
  },
];

// ─── Review Queue ─────────────────────────────────────────────────────────────

export const mockReviewSubmissions: MockReviewSubmission[] = [
  {
    id: 1,
    title: "Evaluating CNN Models for Plant Disease Detection",
    authors: ["Johnny Doe", "Mia Santos", "Rina Cruz"],
    advisers: ["Dr. Ramon Velasquez", "Prof. Cynthia Lim"],
    department: "BSCS",
    studyType: "thesis",
    publicationDate: "June 2025",
    publicationLink: null,
    researchArea: "Data Science",
    tags: ["CNN", "Computer Vision", "Plant Disease", "Deep Learning"],
    reviewStatus: "for_review",
    abstract:
      "This study evaluates the effectiveness of convolutional neural networks for early plant disease detection using image-based classification and field data.",
    recommendations:
      "Future researchers should explore transfer learning approaches using larger datasets to improve generalization beyond controlled environments.",
    lessonsLearned:
      "Useful benchmarking approach and dataset handling guidance for future experiments. Proper data augmentation is critical for small agricultural datasets.",
    submittedAt: "2026-06-25T08:00:00Z",
    primaryFile: {
      fileName: "cnn-plant-disease.pdf",
      fileSize: "3.2 MB",
      pdfUrl: "/dummy.pdf",
    },
    fieldComments: mockComments.filter((c) => c.thesisId === 1),
    auditEvents: mockAuditEvents
      .filter((e) => e.thesisId === 1)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  },
  {
    id: 2,
    title: "A Comparative Study of Sorting Algorithms",
    authors: ["Ben Nignit"],
    advisers: ["Prof. Cynthia Lim"],
    department: "BSIT",
    studyType: "capstone",
    publicationDate: "May 2025",
    publicationLink: "https://arxiv.org/abs/2506.12345",
    researchArea: "Software Engineering",
    tags: ["Algorithms", "Complexity", "Sorting", "Performance Analysis"],
    reviewStatus: "accepted",
    abstract:
      "A comparative evaluation of merge sort, quick sort, heap sort, and radix sort across execution time and memory efficiency.",
    recommendations:
      "Extend the benchmark to include parallel sorting algorithms for multi-core environments.",
    lessonsLearned:
      "The workflow was efficient, but the final testing section should be expanded to cover edge cases.",
    submittedAt: "2026-06-20T09:00:00Z",
    primaryFile: {
      fileName: "sorting-algorithms.pdf",
      fileSize: "1.8 MB",
      pdfUrl: "/dummy.pdf",
    },
    fieldComments: mockComments.filter((c) => c.thesisId === 2),
    auditEvents: mockAuditEvents
      .filter((e) => e.thesisId === 2)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  },
  {
    id: 3,
    title: "Smart Irrigation System Using IoT Sensors",
    authors: ["Justine Time", "Liam Ortiz"],
    advisers: ["Dr. Elena Faustino"],
    department: "BSIS",
    studyType: "thesis",
    publicationDate: "April 2025",
    publicationLink: null,
    researchArea: "IoT",
    tags: ["IoT", "Embedded Systems", "Agriculture", "Sensors"],
    reviewStatus: "for_review",
    abstract:
      "This thesis presents a low-cost irrigation system that uses IoT sensors and automated controls to improve water conservation.",
    recommendations:
      "Consider solar-powered prototypes and real-time cloud dashboards for farmer accessibility.",
    lessonsLearned:
      "The prototype was effective, but the documentation should be improved for future maintainers.",
    submittedAt: "2026-06-14T13:00:00Z",
    primaryFile: {
      fileName: "smart-irrigation-system.pdf",
      fileSize: "2.4 MB",
      pdfUrl: "/dummy.pdf",
    },
    fieldComments: mockComments.filter((c) => c.thesisId === 3),
    auditEvents: mockAuditEvents
      .filter((e) => e.thesisId === 3)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  },
  {
    id: 4,
    title: "Real-Time Object Detection on Edge Devices",
    authors: ["Homer Adriel", "Ava Gomez", "Kyle Tan"],
    advisers: ["Dr. Ramon Velasquez"],
    department: "BSCS",
    studyType: "capstone",
    publicationDate: "March 2025",
    publicationLink: null,
    researchArea: "Computer Vision",
    tags: ["YOLO", "Edge Computing", "Object Detection", "Latency"],
    reviewStatus: "flagged",
    abstract:
      "The project studies lightweight object detection models for embedded devices and evaluates runtime performance against latency constraints.",
    recommendations:
      "Benchmark against newer lightweight architectures like MobileNetV3 for a more current baseline.",
    lessonsLearned:
      "Latency optimization needs better explanation in the evaluation results. Start with simpler baseline models first.",
    submittedAt: "2026-06-08T10:00:00Z",
    primaryFile: {
      fileName: "edge-object-detection.pdf",
      fileSize: "4.1 MB",
      pdfUrl: "/dummy.pdf",
    },
    fieldComments: mockComments.filter((c) => c.thesisId === 4),
    auditEvents: mockAuditEvents
      .filter((e) => e.thesisId === 4)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  },
  {
    id: 5,
    title: "Forecasting Student Performance Using ML",
    authors: ["Gough Tom", "Nina Reyes"],
    advisers: ["Prof. Cynthia Lim", "Dr. Elena Faustino"],
    department: "BSIT",
    studyType: "thesis",
    publicationDate: "February 2025",
    publicationLink: null,
    researchArea: "Data Science",
    tags: ["Machine Learning", "Education Technology", "Prediction", "GPA"],
    reviewStatus: "for_review",
    abstract:
      "A machine learning model is built to forecast student performance based on attendance, grade trends, and engagement signals.",
    recommendations:
      "Expand the feature set to include extracurricular activities and financial aid status for a more holistic model.",
    lessonsLearned:
      "The modeling section was thoughtful, but the feature selection rationale should be explained further.",
    submittedAt: "2026-06-02T08:00:00Z",
    primaryFile: {
      fileName: "student-performance-forecasting.pdf",
      fileSize: "2.9 MB",
      pdfUrl: "/dummy.pdf",
    },
    fieldComments: mockComments.filter((c) => c.thesisId === 5),
    auditEvents: mockAuditEvents
      .filter((e) => e.thesisId === 5)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  },
];

export function updateReviewSubmission(
  id: number,
  updates: Partial<MockReviewSubmission>,
): MockReviewSubmission | null {
  const index = mockReviewSubmissions.findIndex(
    (submission) => submission.id === id,
  );

  if (index === -1) {
    return null;
  }

  const updatedSubmission: MockReviewSubmission = {
    ...mockReviewSubmissions[index],
    ...updates,
  };

  mockReviewSubmissions[index] = updatedSubmission;
  return updatedSubmission;
}

export function addFieldComment(
  thesisId: number,
  comment: Omit<ReviewComment, "id">,
): ReviewComment {
  const newId =
    Math.max(0, ...mockComments.map((c) => c.id)) + 1;
  const newComment: ReviewComment = { ...comment, id: newId };
  mockComments.push(newComment);

  const submission = mockReviewSubmissions.find((s) => s.id === thesisId);
  if (submission) {
    submission.fieldComments = [...submission.fieldComments, newComment];
  }
  return newComment;
}

// ─── Uploads (legacy — used by dashboard and all-studies pages) ───────────────

export const mockUploads: MockUpload[] = [
  { id: 1, title: "Evaluating CNN Models for Plant Disease Detection", author: "Johnny Doe", dateCreated: "06/25/2025", status: "Pending" },
  { id: 2, title: "A Comparative Study of Sorting Algorithms", author: "Ben Nignit", dateCreated: "06/07/2025", status: "Approved" },
  { id: 3, title: "Smart Irrigation System Using IoT Sensors", author: "Justine Time", dateCreated: "05/19/2025", status: "Approved" },
  { id: 4, title: "Blockchain-Based Voting System for Campus Elections", author: "Cal Amay", dateCreated: "05/19/2025", status: "Pending" },
  { id: 5, title: "Emotion Detection from Speech Using Deep Learning", author: "Leira Bengil", dateCreated: "05/19/2025", status: "Approved" },
  { id: 6, title: "Real-Time Object Detection on Edge Devices", author: "Homer Adriel", dateCreated: "04/12/2025", status: "Flagged" },
  { id: 7, title: "Automated Grading System for Programming Assignments", author: "Tab Leah", dateCreated: "04/02/2025", status: "Approved" },
  { id: 8, title: "Forecasting Student Performance Using ML", author: "Gough Tom", dateCreated: "03/28/2025", status: "Pending" },
];

// ─── Members ──────────────────────────────────────────────────────────────────

export const mockMembers: MockMember[] = [
  { id: 1, name: "Ben Nignit", email: "benignit@example.com", affiliation: "Professor" },
  { id: 2, name: "Gough Tom", email: "geugh@example.com", affiliation: "Alumni" },
  { id: 3, name: "Homer Adriel Dorin", email: "peacetech@gmail.com", affiliation: "Alumni" },
  { id: 4, name: "Leira Bengil", email: "bengil@gmail.com", affiliation: "Professor" },
  { id: 5, name: "Tab Leah", email: "tabla@yahoo.com", affiliation: "Student" },
  { id: 6, name: "Cal Amay", email: "camay@usc.edu.ph", affiliation: "Student" },
  { id: 7, name: "Justine Time", email: "jtime@usc.edu.ph", affiliation: "Student" },
];

// ─── Moderators ───────────────────────────────────────────────────────────────

export const mockModerators: MockModerator[] = [
  { id: 1, name: "Johnny Doe", email: "jdoe@usc.edu.ph" },
  { id: 2, name: "Anna Reyes", email: "areyes@usc.edu.ph" },
];

// ─── Summary Stats ────────────────────────────────────────────────────────────

export const mockStats = {
  totalResearch: mockUploads.length,
  registeredUsers: mockMembers.length + mockModerators.length,
  pendingDocs: mockUploads.filter((u) => u.status === "Pending").length,
};

// ─── Recent Activity ──────────────────────────────────────────────────────────

export const mockActivity = [
  { date: "June 2026", text: "Johnny Doe uploaded \"Evaluating CNN Models for Plant Disease Detection\"" },
  { date: "June 2026", text: "Ben Nignit registered on the platform" },
  { date: "June 2026", text: "Cal Amay registered on the platform" },
  { date: "May 2026", text: "Leira Bengil uploaded \"Emotion Detection from Speech Using Deep Learning\"" },
  { date: "May 2026", text: "Homer Adriel submitted a thesis for review" },
];

// ─── Research by Department ───────────────────────────────────────────────────

export const mockByDepartment = [
  { label: "BSCS", count: 120 },
  { label: "BSIT", count: 67 },
  { label: "BSIS", count: 23 },
];
