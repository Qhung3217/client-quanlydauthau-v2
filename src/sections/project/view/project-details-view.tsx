'use client';

import type { ProjectDetails } from 'src/types/project';

import { Stack } from '@mui/material';

import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ProjectItem from '../project-item';
import ProjectDetailsSkeleton from '../project-skeleton';
import ProjectEstimateList from '../project-estimate-list';
import ProjectReviewControl from '../project-review-control';
import useProjectActions from '../hooks/use-project-actions';

type Props = {
  project: ProjectDetails;
  loading: boolean;
};

export default function ProjectDetailsView({ project, loading }: Props) {
  const { renderConfirmDialog } = useProjectActions();

  if (loading) {
    return (
      <MainContent>
        <ProjectDetailsSkeleton />
      </MainContent>
    );
  }

  return (
    <MainContent>
      <CustomBreadcrumbs
        heading={project.name || 'Dự án'}
        links={[{ name: 'Tất cả dự án', href: paths.project.root }, { name: `#${project.code}` }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Stack spacing={3}>
        <ProjectReviewControl project={project} />

        <ProjectItem project={project} />

        <ProjectEstimateList project={project} />
      </Stack>

      {renderConfirmDialog()}
    </MainContent>
  );
}
