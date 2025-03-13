'use client';

import { useAuthContext } from './use-auth-context';

// Define base type for access roles
type AccessRole = {
  [K: string]: string;
};

// Create mapped type for the return type based on input keys
type PermissionResult<T extends AccessRole> = {
  [K in keyof T]: boolean;
};
export default function useCheckPermission<T extends AccessRole>(
  accessRole: T
): PermissionResult<T> {
  const { user } = useAuthContext();
  const permissions: string[] = user?.permissions || [];

  const permissionKeys = Object.keys(accessRole);

  const result = permissionKeys.reduce((acc, key: keyof T) => {
    acc[key] = permissions.includes(accessRole[key]);
    return acc;
  }, {} as PermissionResult<T>);

  return result;
}
