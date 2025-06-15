
import { Timestamp } from 'firebase/firestore';

// Data shape for documents in the Firestore "jobs" collection
export interface Job {
  id: string; // Document ID
  title: string;
  company: string;
  status: 'Active' | 'Pending' | 'Expired';
  applications: number;
  postedDate: Timestamp;
  deadline: Timestamp;
}

// Data shape for the form used to create/edit jobs
export type JobFormValues = {
  title: string;
  company: string;
  status: 'Active' | 'Pending' | 'Expired';
  deadline: Date;
};
