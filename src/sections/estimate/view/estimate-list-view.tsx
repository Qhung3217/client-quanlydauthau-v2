import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import EstimateList from '../estimate-list';

export default function EstimateListView() {
  return (
    <MainContent>
      <CustomBreadcrumbs
        heading="Tất cả dự toán"
        links={[{ name: 'Tất cả dự toán', href: paths.estimate.root }, { name: 'Danh sách' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <EstimateList />
    </MainContent>
  );
}
