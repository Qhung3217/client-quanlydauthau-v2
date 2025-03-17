import type { User } from 'src/types/user';

import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserNewEditForm } from '../user-new-edit-form';

type Props = {
  record: User | undefined;
  loading: boolean;
};
export default function UserEditView({ record, loading }: Props) {
  return (
    <MainContent>
      <CustomBreadcrumbs
        heading="Cập nhật tài khoản"
        links={[
          { name: 'Tài khoản', href: paths.user.root },
          { name: record?.name || 'Cập nhật tài khoản' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm currentRecord={record} loading={loading} />
    </MainContent>
  );
}
