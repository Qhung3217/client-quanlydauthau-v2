'use client';

import { notFound } from 'next/navigation';

import { useGetEstimate } from 'src/actions/estimate';
import { PERMISSION_ENUM } from 'src/constants/permission';

import ProjectEstimateView from 'src/sections/estimate/view/project-estimate-view';

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
  return (
    <RoleBasedGuard
      acceptRoles={[PERMISSION_ENUM.VIEW_ESTIMATE]}
      currentRole={user?.permissions}
      hasContent
    >
      <ProjectEstimateView estimate={estimate!} loading={estimateLoading} />
    </RoleBasedGuard>
  );
}
