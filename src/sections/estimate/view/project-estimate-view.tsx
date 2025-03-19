import type { EstimateDetails } from 'src/types/estimate';

import { Paper, Stack, Alert, Typography, CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import EstimateAlertEdit from '../estimate-alert-edit';
import ProductEstimatedList from '../product-estimated-list';

type Props = {
  estimate: EstimateDetails | undefined;
  loading: boolean;
};
export default function ProjectEstimateView({ estimate, loading }: Props) {
  const project = estimate?.project;

  const isRequestEdit = estimate?.status === 'EDIT_REQUESTED';

  const isPending = estimate?.status === 'PENDING';
  const isApproved = estimate?.status === 'APPROVED';
  const isCanceled = estimate?.status === 'CANCELED';

  if (loading)
    return (
      <MainContent
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 150 }}
      >
        <CircularProgress size={70} />
      </MainContent>
    );

  const renderAlert = () => {
    if (isApproved) return <Alert>Dự toán đã được duyệt</Alert>;
    if (isCanceled) return <Alert severity="error">Dự toán bị từ chối</Alert>;
    return <Alert severity="warning">Dự toán đang chờ duyệt</Alert>;
  };
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
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h5"> Giới thiệu chung về dự án</Typography>
          <Typography>
            - <strong>Dự án: </strong> {project?.name}
          </Typography>
          <Typography>
            - <strong>Bên mời thầu: </strong> {project?.inviter?.name}
          </Typography>
          <Typography>
            - <strong>Chủ đầu từ: </strong> {project?.investor?.name}
          </Typography>
          <Typography>
            - <strong>Địa điểm: </strong> {project?.address}
          </Typography>
        </Paper>
        <ProductEstimatedList productEsts={estimate?.productEstimates || []} />
      </Stack>

      {isRequestEdit && <EstimateAlertEdit id={estimate.id} />}
    </MainContent>
  );
}
