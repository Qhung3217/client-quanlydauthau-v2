'use client';

import { notFound } from 'next/navigation';

import { useGetProject } from 'src/actions/project';
import { PERMISSION_ENUM } from 'src/constants/permission';

import ProjectEditView from 'src/sections/project/view/project-edit-view';

import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------
type Props = {
  params: { id: string };
};

export default function Page({ params: { id } }: Props) {
  const { user } = useAuthContext();

  const { project, projectEmpty, projectLoading } = useGetProject(id);
  if (projectEmpty) return notFound();
  return (
    <RoleBasedGuard
      acceptRoles={[PERMISSION_ENUM.UPDATE_PROJECT]}
      currentRole={user?.permissions}
      hasContent
    >
      <ProjectEditView record={project!} loading={projectLoading} />
    </RoleBasedGuard>
  );
}
