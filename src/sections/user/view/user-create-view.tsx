import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserNewEditForm } from '../user-new-edit-form';

export default function UserCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Thêm tài khoản mới"
        links={[{ name: 'Tài khoản', href: paths.user.root }, { name: 'Tài khoản mới' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm />
    </DashboardContent>
  );
}
