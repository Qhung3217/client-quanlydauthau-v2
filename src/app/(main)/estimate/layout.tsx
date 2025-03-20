'use client';

import { PERMISSION_ENUM } from 'src/constants/permission';

import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------
type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { user } = useAuthContext();

  return (
    <RoleBasedGuard
      acceptRoles={[PERMISSION_ENUM.VIEW_ESTIMATE]}
      currentRole={user?.permissions}
      hasContent
    >
      {children}
    </RoleBasedGuard>
  );
}
