import type { ProjectStatus } from 'src/types/project';

export const PROJECT_STATUS: ProjectStatus[] = [
  'PENDING',
  'APPROVED',
  'QUOTED',
  'CANCELED',
  'COMPLETED',
];

export const PUBLIC_PROJECT_STATUS: ProjectStatus[] = ['APPROVED', 'QUOTED'];

export const PROJECT_STATUS_OBJ: { [k in ProjectStatus]: ProjectStatus } = {
  QUOTED: 'QUOTED',
  APPROVED: 'APPROVED',
  CANCELED: 'CANCELED',
  COMPLETED: 'COMPLETED',
  PENDING: 'PENDING',
};
