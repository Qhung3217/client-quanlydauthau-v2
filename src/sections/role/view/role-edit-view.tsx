import type { Role } from 'src/types/role';

import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RoleNewEditForm } from '../role-new-edit-form';

type Props = {
  record: Role | undefined;
  loading: boolean;
};
export default function RoleEditView({ record, loading }: Props) {
  return (
    <MainContent>
      <CustomBreadcrumbs
        heading="Cập nhật nhóm quyền"
        links={[
          { name: 'Nhóm quyền', href: paths.role.root },
          { name: record?.name || 'Cập nhật nhóm quyền' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RoleNewEditForm currentRecord={record} loading={loading} />
    </MainContent>
  );
}
