import type { PermissionInRole } from './permission';

export type Role = {
  id: string;
  name: string;
  permissions: PermissionInRole[];
};
