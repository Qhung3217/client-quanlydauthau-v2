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
      acceptRoles={[PERMISSION_ENUM.CHANGE_MY_PASSWORD, PERMISSION_ENUM.UPDATE_MY_PROFILE]}
      currentRole={user?.permissions}
      hasContent
    >
      {children}
    </RoleBasedGuard>
  );
}
