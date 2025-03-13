import type { Company } from 'src/types/company';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CompanyNewEditForm } from '../company-new-edit-form';

type Props = {
  record: Company | undefined;
  loading: boolean;
};
export default function CompanyEditView({ record, loading }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Cập nhật đơn vị"
        links={[
          { name: 'Đơn vị', href: paths.organization.root },
          { name: record?.name || 'Cập nhật đơn vị' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CompanyNewEditForm currentRecord={record} loading={loading} />
    </DashboardContent>
  );
}
