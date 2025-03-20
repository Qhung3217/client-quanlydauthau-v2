'use client';

import { notFound } from 'next/navigation';

import { CircularProgress } from '@mui/material';

import { MainContent } from 'src/layouts/main';
import { useGetProject } from 'src/actions/project';
import { PERMISSION_ENUM } from 'src/constants/permission';

import ProjectEstimateCreateView from 'src/sections/estimate/view/project-estimate-create-view';

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
  if (projectLoading)
    return (
      <MainContent
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 150 }}
      >
        <CircularProgress size={70} />
      </MainContent>
    );
  return (
    <RoleBasedGuard
      acceptRoles={[PERMISSION_ENUM.CREATE_ESTIMATE]}
      currentRole={user?.permissions}
      hasContent
    >
      <ProjectEstimateCreateView project={project!} loading={projectLoading} />
    </RoleBasedGuard>
  );
}
