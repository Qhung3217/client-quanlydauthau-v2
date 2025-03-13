import type { Creator } from './user';

export type ProjectStatus = 'PENDING' | 'APPROVED' | 'CANCELED' | 'COMPLETED' | 'QUOTED';
export type Project = {
  id: string;
  name: string;
  code: string;
  address: string;
  status: ProjectStatus;
  updatedAt: Date;
  createdAt: Date;
  creator: Creator;
};
