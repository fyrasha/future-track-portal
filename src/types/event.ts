
import { Timestamp } from 'firebase/firestore';

export type EventType = 'career' | 'workshop' | 'networking' | 'seminar' | 'orientation' | 'academic' | 'visit' | 'interview';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Event {
  id: string; // Document ID
  name: string;
  description: string;
  type: EventType;
  date: Timestamp;
  time: string;
  location: string;
  status: EventStatus;
  participants: number;
  capacity: number;
  createdAt: Timestamp;
}

export type EventFormValues = {
  name: string;
  description: string;
  type: EventType;
  date: string;
  time: string;
  location: string;
  capacity: number;
  status: EventStatus;
};
