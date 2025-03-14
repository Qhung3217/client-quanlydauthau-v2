import { Box, Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { PERMISSION_ENUM } from 'src/constants/permission';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useCheckPermission } from 'src/auth/hooks';

export default function ProjectListView() {
  const { CREATE_PERMIT } = useCheckPermission({
    CREATE_PERMIT: PERMISSION_ENUM.CREATE_PROJECT,
  });
  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Dự án công khai"
        links={[{ name: 'Dự án công khai', href: paths.project.root }, { name: 'Danh sách' }]}
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
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1,1fr)',
            md: 'repeat(2,1fr)',
          },
          gap: 2,
        }}
      >
        <ProductList
          onSelected={setProductSelected}
          resetSelected={() => setProductSelected(null)}
        />
      </Box>
    </DashboardContent>
  );
}
