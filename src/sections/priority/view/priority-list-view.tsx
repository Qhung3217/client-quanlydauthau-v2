'use client';

import { useBoolean } from 'minimal-shared/hooks';

import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';
import { PERMISSION_ENUM } from 'src/constants/permission';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useCheckPermission } from 'src/auth/hooks';

import PriorityList from '../priority-list';
import PriorityCreateDialog from './priority-create-dialog';

export default function PriorityListView() {
  const { CREATE_PERMIT } = useCheckPermission({
    CREATE_PERMIT: PERMISSION_ENUM.CREATE_PRIORITY,
  });

  const openCreate = useBoolean();

  return (
    <MainContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Danh sách độ ưu tiên"
        links={[{ name: 'Độ ưu tiên', href: paths.product.root }, { name: 'Danh sách' }]}
        action={
          CREATE_PERMIT && (
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={openCreate.onTrue}
            >
              Độ ưu tiên mới
            </Button>
          )
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <PriorityList />
      <PriorityCreateDialog open={openCreate.value} onClose={openCreate.onFalse} />
    </MainContent>
  );
}
