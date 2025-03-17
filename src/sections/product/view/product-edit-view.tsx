import type { Product } from 'src/types/product';

import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductNewEditForm } from '../product-new-edit-form';

type Props = {
  record: Product | undefined;
  loading: boolean;
};
export default function ProductEditView({ record, loading }: Props) {
  return (
    <MainContent>
      <CustomBreadcrumbs
        heading="Cập nhật sản phẩm"
        links={[
          { name: 'Sản phẩm', href: paths.product.root },
          { name: record?.name || 'Cập nhật sản phẩm' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductNewEditForm currentRecord={record} loading={loading} />
    </MainContent>
  );
}
