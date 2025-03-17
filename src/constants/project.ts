import type { ProjectStatus } from 'src/types/project';

export const PROJECT_STATUS: ProjectStatus[] = [
  'PENDING',
  'APPROVED',
  'EDIT_REQUESTED',
  'BUDGET_APPROVED',
  'QUOTED',
  'CANCELED',
  'COMPLETED',
];

export const PUBLIC_PROJECT_STATUS: ProjectStatus[] = ['APPROVED', 'BUDGET_APPROVED'];

export const PROJECT_STATUS_OBJ: { [k in ProjectStatus]: ProjectStatus } = {
  QUOTED: 'QUOTED',
  APPROVED: 'APPROVED',
  CANCELED: 'CANCELED',
  BUDGET_APPROVED: 'BUDGET_APPROVED',
  EDIT_REQUESTED: 'EDIT_REQUESTED',
  COMPLETED: 'COMPLETED',
  PENDING: 'PENDING',
};
