import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductNewEditForm } from '../product-new-edit-form';

export default function ProductCreateView() {
  return (
    <MainContent>
      <CustomBreadcrumbs
        heading="Thêm sản phẩm mới"
        links={[{ name: 'Sản phẩm', href: paths.product.root }, { name: 'Sản phẩm mới' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductNewEditForm />
    </MainContent>
  );
}
