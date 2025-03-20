'use client';

import { notFound } from 'next/navigation';

import { CircularProgress } from '@mui/material';

import { MainContent } from 'src/layouts/main';
import { useGetEstimate } from 'src/actions/estimate';
import { PERMISSION_ENUM } from 'src/constants/permission';

import ProjectEstimateEditView from 'src/sections/estimate/view/project-estimate-edit-view';

import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------
type Props = {
  params: { id: string };
};

export default function Page({ params: { id } }: Props) {
  const { user } = useAuthContext();

  const { estimate, estimateEmpty, estimateLoading } = useGetEstimate(id);
  if (estimateEmpty) return notFound();
  if (estimateLoading)
    return (
      <MainContent
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 150 }}
      >
        <CircularProgress size={70} />
      </MainContent>
    );
  return (
    <RoleBasedGuard
      acceptRoles={[PERMISSION_ENUM.UPDATE_ESTIMATE]}
      currentRole={user?.permissions}
      hasContent
    >
      <ProjectEstimateEditView estimate={estimate!} loading={estimateLoading} />
    </RoleBasedGuard>
  );
}
