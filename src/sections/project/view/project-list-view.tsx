'use client';

import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { MainContent } from 'src/layouts/main';
import { PERMISSION_ENUM } from 'src/constants/permission';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useCheckPermission } from 'src/auth/hooks';

import ProjectList from '../project-list';

export default function ProjectListView() {
  const { CREATE_PERMIT } = useCheckPermission({
    CREATE_PERMIT: PERMISSION_ENUM.CREATE_PROJECT,
  });
  return (
    <MainContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Tất cả dự án"
        links={[{ name: 'Tất cả dự án', href: paths.project.root }, { name: 'Danh sách' }]}
        action={
          CREATE_PERMIT && (
            <Button
              component={RouterLink}
              href={paths.project.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Dự án mới
            </Button>
          )
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProjectList />
    </MainContent>
  );
}
