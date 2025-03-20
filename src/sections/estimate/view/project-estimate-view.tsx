import type { ProjectDetails } from 'src/types/project';

import { useMemo } from 'react';
import { notFound } from 'next/navigation';

import { Stack, Alert } from '@mui/material';

import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';
import { PERMISSION_ENUM } from 'src/constants/permission';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ProjectItem from 'src/sections/project/project-item';

import { useAuthContext, useCheckPermission } from 'src/auth/hooks';

import EstimateAlertEdit from '../estimate-alert-edit';
import ProductEstimatedList from '../product-estimated-list';

type Props = {
  project: ProjectDetails;
  loading: boolean;
};
export default function ProjectEstimateView({ project, loading }: Props) {
  const { user } = useAuthContext();
  const userId = user?.id || '';

  const { UPDATE_PERMIT } = useCheckPermission({
    UPDATE_PERMIT: PERMISSION_ENUM.UPDATE_ESTIMATE,
  });

  const estimate = useMemo(
    () => project.estimates.find((est) => est.creator.id === userId),
    [project, userId]
  );

  const showRequestEditDialog = estimate?.status === 'EDIT_REQUESTED' && UPDATE_PERMIT;

  const isRequestEdit = estimate?.status === 'EDIT_REQUESTED';
  const isApproved = estimate?.status === 'APPROVED';
  const isCanceled = estimate?.status === 'CANCELED';

  const renderAlert = () => {
    if (isApproved) return <Alert>Dự toán đã được duyệt</Alert>;
    if (isCanceled)
      return (
        <Alert severity="error" variant="outlined">
          Dự toán bị từ chối
        </Alert>
      );
    if (isRequestEdit)
      return (
        <Alert severity="warning" variant="outlined">
          Dự toán được yêu cầu điều chỉnh
        </Alert>
      );
    return <Alert severity="warning">Dự toán đang chờ duyệt</Alert>;
  };
  if (!estimate) return notFound();
  return (
    <MainContent sx={{ position: 'relative' }}>
      <CustomBreadcrumbs
        heading="Xem dự toán"
        links={[
          { name: 'Tất cả dự án', href: paths.project.root },
          { name: `#${project?.code}`, href: paths.project.details(project?.id) },
          { name: estimate?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
        // action={
        //   <Button variant="soft" color="primary" onClick={openEstimateForm.onTrue}>
        //     Gửi dự toán
        //   </Button>
        // }
      />
      <Stack direction="column" spacing={2}>
        {renderAlert()}

        <ProjectItem project={project} />

        <ProductEstimatedList productEsts={estimate?.productEstimates || []} />
      </Stack>

      {showRequestEditDialog && <EstimateAlertEdit id={estimate.id} />}
    </MainContent>
  );
}
