export type Permission = {
  code: string;
  name: string;
  createdAt: string;
  permissionGroupId: string;
};

export type PermissionGroup = {
  id: string;
  name: string;
  permissions: Permission[];
};

export type PermissionInRole = {
  code: string;
  name: string;
};
