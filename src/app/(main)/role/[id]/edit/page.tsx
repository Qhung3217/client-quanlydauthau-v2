'use client';

import { notFound } from 'next/navigation';

import { useGetRole } from 'src/actions/role';
import { PERMISSION_ENUM } from 'src/constants/permission';

import RoleEditView from 'src/sections/role/view/role-edit-view';

import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------
type Props = {
  params: { id: string };
};

export default function Page({ params: { id } }: Props) {
  const { user } = useAuthContext();

  const { role, roleEmpty, roleLoading } = useGetRole(id);
  if (roleEmpty) return notFound();
  return (
    <RoleBasedGuard
      acceptRoles={[PERMISSION_ENUM.UPDATE_ROLE]}
      currentRole={user?.permissions}
      hasContent
    >
      <RoleEditView record={role!} loading={roleLoading} />
    </RoleBasedGuard>
  );
}
