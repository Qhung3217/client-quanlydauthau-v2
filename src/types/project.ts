import type { Creator } from './user';
import type { Company } from './company';
import type { Priority } from './priority';

export type ProjectStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'CANCELED'
  | 'EDIT_REQUESTED'
  | 'BUDGET_APPROVED'
  | 'COMPLETED'
  | 'QUOTED';

export type Project = {
  id: string;
  name: string;
  code: string;
  address: string;
  status: ProjectStatus;
  estDeadline: string;
  updatedAt: string;
  createdAt: string;
  inviter: Company;
  investor: Company;
  estimates?: Array<{
    id: string;
    status: string;
    projectId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    creatorId: string;
    updaterId: any;
  }>;
  estimators: Creator[];
  priority?: Priority;
  creator: Creator;
  _count: {
    estimates: number;
  };
};
