import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CompanyNewEditForm } from '../company-new-edit-form';

export default function CompanyCreateView() {
  return (
    <MainContent>
      <CustomBreadcrumbs
        heading="Thêm đơn vị mới"
        links={[{ name: 'Đơn vị', href: paths.organization.root }, { name: 'Đơn vị mới' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CompanyNewEditForm />
    </MainContent>
  );
}
