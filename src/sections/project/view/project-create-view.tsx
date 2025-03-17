import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProjectNewEditForm } from '../project-new-edit-form';

export default function ProjectCreateView() {
  return (
    <MainContent>
      <CustomBreadcrumbs
        heading="Đăng dự án mới"
        links={[{ name: 'Dự án của tôi', href: paths.project.root }, { name: 'Thêm mới' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProjectNewEditForm />
    </MainContent>
  );
}
