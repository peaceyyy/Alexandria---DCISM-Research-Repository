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
