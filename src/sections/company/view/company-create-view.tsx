import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CompanyNewEditForm } from '../company-new-edit-form';

export default function CompanyCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Thêm đơn vị mới"
        links={[{ name: 'Đơn vị', href: paths.organization.root }, { name: 'Đơn vị mới' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CompanyNewEditForm />
    </DashboardContent>
  );
}
