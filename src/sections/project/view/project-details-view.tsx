'use client';

import type { ProjectDetails } from 'src/types/project';

import { Box, Stack, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';
import { exportProjectToExcel } from 'src/helpers/project-excel';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import TicketListView from 'src/sections/ticket/view/ticket-list-view';
import { TicketProvider } from 'src/sections/ticket/context/ticket-provider';

import ProjectItem from '../project-item';
import ProjectEstimateList from '../project-estimate-list';
import ProjectReviewControl from '../project-review-control';
import useProjectActions from '../hooks/use-project-actions';

type Props = {
  project: ProjectDetails;
  loading: boolean;
};

export default function ProjectDetailsView({ project, loading }: Props) {
  const { renderConfirmDialog } = useProjectActions();

  const handleExportExcel = () => {
    exportProjectToExcel(project);
  };

  if (loading) return null;

  return (
    <MainContent>
      <TicketProvider>
        <CustomBreadcrumbs
          heading={project.name || 'Dự án'}
          links={[{ name: 'Tất cả dự án', href: paths.project.root }, { name: `#${project.code}` }]}
          sx={{ mb: { xs: 3, md: 5 } }}
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="material-symbols:file-export-outline-rounded" width={24} />}
              onClick={handleExportExcel}
            >
              Xuất Excel
            </Button>
          }
        />
        <Stack spacing={3}>
          <ProjectReviewControl project={project} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1,1fr)',
                md: 'repeat(2,1fr)',
              },
            }}
          >
            <Stack spacing={3}>
              <ProjectItem project={project} />

              <ProjectEstimateList
                project={project}
                sx={{
                  '& #estimate-list': {
                    gridTemplateColumns: 'repeat(1,1fr)',
                  },
                }}
              />
            </Stack>

            <Box>
              <TicketListView
                projectId={project.id}
                sx={{
                  '& #ticket-searchbar': {
                    pt: 0,
                  },
                  '& ul': {
                    height: 'unset',
                  },
                }}
              />
            </Box>
          </Box>
        </Stack>
        {renderConfirmDialog()}
      </TicketProvider>
    </MainContent>
  );
}
