import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RoleNewEditForm } from '../role-new-edit-form';

export default function RoleCreateView() {
  return (
    <MainContent>
      <CustomBreadcrumbs
        heading="Thêm nhóm quyền mới"
        links={[{ name: 'Nhóm quyền', href: paths.role.root }, { name: 'Nhóm quyền mới' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RoleNewEditForm />
    </MainContent>
  );
}
