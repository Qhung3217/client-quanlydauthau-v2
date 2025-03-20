'use client';

import type { ProjectDetails } from 'src/types/project';

import { Stack } from '@mui/material';

import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ProjectItem from '../project-item';
import ProjectEstimateList from '../project-estimate-list';
import ProjectReviewControl from '../project-review-control';
import useProjectActions from '../hooks/use-project-actions';
import useProjectActionPermit from '../hooks/use-project-action-permit';

type Props = {
  project: ProjectDetails;
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
    <MainContent >
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
      <Stack spacing={3}>
        <ProjectReviewControl project={project} />

        <ProjectItem
          project={project}
        />

        <ProjectEstimateList estimates={project.estimates}/>
      </Stack>

      {renderConfirmDialog()}

    </MainContent>
  );
}
