
import { Timestamp } from 'firebase/firestore';

export type JobType = 'Full-time' | 'Part-time' | 'Internship' | 'Contract';

// Data shape for documents in the Firestore "jobs" collection
export interface Job {
  id: string; // Document ID
  title: string;
  company: string;
  companyId: string;
  status: 'Active' | 'Pending' | 'Expired';
  applications: number;
  postedDate: Timestamp;
  deadline: Timestamp;
  // New optional fields for backwards compatibility with existing data
  location?: string;
  type?: JobType;
  description?: string;
}

// Data shape for the form used to create/edit jobs
export type JobFormValues = {
  title: string;
  company: string;
  location: string;
  type: JobType;
  description: string;
  status: 'Active' | 'Pending' | 'Expired';
  deadline: Date;
};
