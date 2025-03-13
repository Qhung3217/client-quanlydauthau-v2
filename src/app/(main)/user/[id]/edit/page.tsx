'use client';

import { notFound } from 'next/navigation';

import { useGetUser } from 'src/actions/user';
import { PERMISSION_ENUM } from 'src/constants/permission';

import UserEditView from 'src/sections/user/view/user-edit-view';

import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------
type Props = {
  params: { id: string };
};

export default function Page({ params: { id } }: Props) {
  const { user: currentUser } = useAuthContext();

  const { user, userEmpty, userLoading } = useGetUser(id);
  if (userEmpty) return notFound();
  return (
    <RoleBasedGuard
      acceptRoles={[PERMISSION_ENUM.UPDATE_USER]}
      currentRole={currentUser?.permissions}
      hasContent
    >
      <UserEditView record={user!} loading={userLoading} />
    </RoleBasedGuard>
  );
}
