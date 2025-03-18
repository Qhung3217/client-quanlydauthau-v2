'use client';

import type { Project } from 'src/types/project';

import { Box } from '@mui/material';

import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ProjectTableInfo from '../project-table-info';
import ProjectReviewControl from '../project-review-control';
import useProjectActions from '../hooks/use-project-actions';
import useProjectActionPermit from '../hooks/use-project-action-permit';

type Props = {
  project: Project;
  loading: boolean;
};

export default function ProjectDetailsView({ project, loading }: Props) {
  const { approvePermit, rejectPermit, requestEditPermit } = useProjectActionPermit(
    project?.status || ''
  );

  const { onApprove, onReject, onRequestEdit, isProcessing, renderConfirmDialog } =
    useProjectActions();

  if (loading) return null;
  return (
    <MainContent maxWidth={false}>
      <CustomBreadcrumbs
        heading={project.name || 'Dự án'}
        links={[{ name: 'Tất cả dự án', href: paths.project.root }, { name: `#${project.code}` }]}
        sx={{ mb: { xs: 3, md: 5 } }}
        // action={
        //   <ButtonGroup variant="outlined">
        //     {requestEditPermit && (
        //       <LoadingButton
        //         loading={isProcessing}
        //         onClick={() => onRequestEdit(project)}
        //         variant="soft"
        //         color="info"
        //       >
        //         Y/c điều chỉnh
        //       </LoadingButton>
        //     )}
        //     {rejectPermit && (
        //       <LoadingButton
        //         loading={isProcessing}
        //         onClick={() => onReject(project)}
        //         variant="soft"
        //         color="error"
        //       >
        //         Hủy dự án
        //       </LoadingButton>
        //     )}
        //     {approvePermit && (
        //       <LoadingButton
        //         loading={isProcessing}
        //         onClick={() => onApprove(project)}
        //         variant="soft"
        //         color="primary"
        //       >
        //         Duyệt dự án
        //       </LoadingButton>
        //     )}
        //   </ButtonGroup>
        // }
      />
      <ProjectReviewControl project={project} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1,1fr)',
            md: 'repeat(1,1fr)',
          },
          gap: 2,
        }}
      >
        <ProjectTableInfo project={project} />
      </Box>

      {renderConfirmDialog()}
    </MainContent>
  );
}
