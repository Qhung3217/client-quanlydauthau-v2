import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductNewEditForm } from '../product-new-edit-form';

export default function ProductCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Thêm sản phẩm mới"
        links={[{ name: 'Sản phẩm', href: paths.product.root }, { name: 'Sản phẩm mới' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductNewEditForm />
    </DashboardContent>
  );
}
