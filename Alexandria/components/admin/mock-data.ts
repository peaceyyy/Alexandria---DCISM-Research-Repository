// ============================================================
// Mock data for the Admin Dashboard (no backend binding yet)
// All data shapes mirror the planned API contract types.
// ============================================================

export type UploadStatus = "Pending" | "Approved" | "Flagged";
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

export interface MockReviewSubmission {
  id: number;
  title: string;
  author: string;
  authors: string[];
  department: string;
  studyType: "Thesis" | "Capstone";
  publicationDate: string;
  researchArea: string[];
  lessonsLearned: string;
  submittedAt: string;
  status: UploadStatus;
  abstract: string;
  fileName: string;
  fileSize: string;
  category: string;
  pdfUrl: string;
  moderatorComment: string;
  comments: string[];
}

// --- Uploads ---
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

// --- Members ---
export const mockMembers: MockMember[] = [
  { id: 1, name: "Ben Nignit", email: "benignit@example.com", affiliation: "Professor" },
  { id: 2, name: "Gough Tom", email: "geugh@example.com", affiliation: "Alumni" },
  { id: 3, name: "Homer Adriel Dorin", email: "peacetech@gmail.com", affiliation: "Alumni" },
  { id: 4, name: "Leira Bengil", email: "bengil@gmail.com", affiliation: "Professor" },
  { id: 5, name: "Tab Leah", email: "tabla@yahoo.com", affiliation: "Student" },
  { id: 6, name: "Cal Amay", email: "camay@usc.edu.ph", affiliation: "Student" },
  { id: 7, name: "Justine Time", email: "jtime@usc.edu.ph", affiliation: "Student" },
];

// --- Moderators ---
export const mockModerators: MockModerator[] = [
  { id: 1, name: "Johnny Doe", email: "jdoe@usc.edu.ph" },
  { id: 2, name: "Anna Reyes", email: "areyes@usc.edu.ph" },
];

// --- Review Queue ---
export const mockReviewSubmissions: MockReviewSubmission[] = [
  {
    id: 1,
    title: "Evaluating CNN Models for Plant Disease Detection",
    author: "Johnny Doe",
    authors: ["Johnny Doe", "Mia Santos", "Rina Cruz"],
    department: "BSCS",
    studyType: "Thesis",
    publicationDate: "June 2025",
    researchArea: ["Data Science", "Computer Vision"],
    lessonsLearned: "Useful benchmarking approach and dataset handling guidance for future experiments.",
    submittedAt: "06/25/2025",
    status: "Pending",
    abstract:
      "This study evaluates the effectiveness of convolutional neural networks for early plant disease detection using image-based classification and field data.",
    fileName: "cnn-plant-disease.pdf",
    fileSize: "3.2 MB",
    category: "Artificial Intelligence",
    pdfUrl: "/dummy.pdf",
    moderatorComment: "Please verify the methodology and confirm the dataset was properly cited.",
    comments: [
      "Please verify the methodology and confirm the dataset was properly cited.",
      "The literature review is strong, but the evaluation section needs more detail.",
    ],
  },
  {
    id: 2,
    title: "A Comparative Study of Sorting Algorithms",
    author: "Ben Nignit",
    authors: ["Ben Nignit"],
    department: "BSIT",
    studyType: "Capstone",
    publicationDate: "May 2025",
    researchArea: ["Software Engineering"],
    lessonsLearned: "The workflow was efficient, but the final testing section should be expanded.",
    submittedAt: "06/20/2025",
    status: "Approved",
    abstract:
      "A comparative evaluation of merge sort, quick sort, heap sort, and radix sort across execution time and memory efficiency.",
    fileName: "sorting-algorithms.pdf",
    fileSize: "1.8 MB",
    category: "Computer Science",
    pdfUrl: "/dummy.pdf",
    moderatorComment: "Looks solid, but the conclusion should be tightened.",
    comments: ["Looks solid, but the conclusion should be tightened."],
  },
  {
    id: 3,
    title: "Smart Irrigation System Using IoT Sensors",
    author: "Justine Time",
    authors: ["Justine Time", "Liam Ortiz"],
    department: "BSIS",
    studyType: "Thesis",
    publicationDate: "April 2025",
    researchArea: ["IoT", "Embedded Systems"],
    lessonsLearned: "The prototype was effective, but the documentation should be improved for future maintainers.",
    submittedAt: "06/14/2025",
    status: "Pending",
    abstract:
      "This thesis presents a low-cost irrigation system that uses IoT sensors and automated controls to improve water conservation.",
    fileName: "smart-irrigation-system.pdf",
    fileSize: "2.4 MB",
    category: "IoT",
    pdfUrl: "/dummy.pdf",
    moderatorComment: "Needs a more detailed implementation section.",
    comments: ["Needs a more detailed implementation section."],
  },
  {
    id: 4,
    title: "Real-Time Object Detection on Edge Devices",
    author: "Homer Adriel",
    authors: ["Homer Adriel", "Ava Gomez", "Kyle Tan"],
    department: "BSCS",
    studyType: "Capstone",
    publicationDate: "March 2025",
    researchArea: ["Computer Vision", "Edge Computing"],
    lessonsLearned: "Latency optimization needs better explanation in the evaluation results.",
    submittedAt: "06/08/2025",
    status: "Flagged",
    abstract:
      "The project studies lightweight object detection models for embedded devices and evaluates runtime performance against latency constraints.",
    fileName: "edge-object-detection.pdf",
    fileSize: "4.1 MB",
    category: "Computer Vision",
    pdfUrl: "/dummy.pdf",
    moderatorComment: "Please check whether the evaluation metrics are clearly explained.",
    comments: ["Please check whether the evaluation metrics are clearly explained."],
  },
  {
    id: 5,
    title: "Forecasting Student Performance Using ML",
    author: "Gough Tom",
    authors: ["Gough Tom", "Nina Reyes"],
    department: "BSIT",
    studyType: "Thesis",
    publicationDate: "February 2025",
    researchArea: ["Data Science", "Education Technology"],
    lessonsLearned: "The modeling section was thoughtful, but the feature selection should be explained further.",
    submittedAt: "06/02/2025",
    status: "Pending",
    abstract:
      "A machine learning model is built to forecast student performance based on attendance, grade trends, and engagement signals.",
    fileName: "student-performance-forecasting.pdf",
    fileSize: "2.9 MB",
    category: "Data Science",
    pdfUrl: "/dummy.pdf",
    moderatorComment: "The model summary is good; confirm the source data was documented.",
    comments: ["The model summary is good; confirm the source data was documented."],
  },
];

export function updateReviewSubmission(
  id: number,
  updates: Partial<MockReviewSubmission>,
): MockReviewSubmission | null {
  const index = mockReviewSubmissions.findIndex((submission) => submission.id === id);

  if (index === -1) {
    return null;
  }

  const updatedSubmission = {
    ...mockReviewSubmissions[index],
    ...updates,
  };

  mockReviewSubmissions[index] = updatedSubmission;
  return updatedSubmission;
}

// --- Summary Stats ---
export const mockStats = {
  totalResearch: mockUploads.length,
  registeredUsers: mockMembers.length + mockModerators.length,
  pendingDocs: mockUploads.filter((u) => u.status === "Pending").length,
};

// --- Recent Activity ---
export const mockActivity = [
  { date: "June 2026", text: "Johnny Doe uploaded \"Evaluating CNN Models for Plant Disease Detection\"" },
  { date: "June 2026", text: "Ben Nignit registered on the platform" },
  { date: "June 2026", text: "Cal Amay registered on the platform" },
  { date: "May 2026", text: "Leira Bengil uploaded \"Emotion Detection from Speech Using Deep Learning\"" },
  { date: "May 2026", text: "Homer Adriel submitted a thesis for review" },
];

// --- Research by Department ---
export const mockByDepartment = [
  { label: "BSCS", count: 120 },
  { label: "BSIT", count: 67 },
  { label: "BSIS", count: 23 },
];
