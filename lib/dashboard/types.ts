export type Role = "super_admin" | "admin" | "usher" | "media" | "attendee";

export type MemberStatus = "pending" | "approved" | "suspended";

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  /** Role the super admin has confirmed. */
  role: Role;
  /** Role the person picked when they registered. */
  requestedRole: Role;
  status: MemberStatus;
  joinedAt: string; // ISO date
  /** 0–100, share of services attended in the last 8 weeks. */
  attendanceRate: number;
  lastAttended: string | null; // ISO date
}

export interface ChurchService {
  id: string;
  name: string;
  kind: "weekly" | "special";
  day: string; // "Sunday" or a date label for special events
  time: string;
  location: string;
  expected: number;
}

export interface Project {
  id: string;
  name: string;
  category: "Building" | "Education" | "Outreach";
  description: string;
  /** Optional: why the project exists / what it aims to achieve. */
  purpose?: string;
  /** Optional: how many people are currently participating. */
  participants?: number;
  /** 0–100 */
  progress: number;
  sponsors: number;
  status: "active" | "planning" | "completed";
}

export type SubmissionStatus = "new" | "in_review" | "active" | "declined";

export interface Submission {
  id: string;
  name: string;
  email: string;
  subject: string;
  note: string;
  submittedAt: string; // ISO date
  status: SubmissionStatus;
}
