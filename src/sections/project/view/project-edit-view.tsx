import type { Project } from 'src/types/project';

import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProjectNewEditForm } from '../project-new-edit-form';

type Props = {
  record: Project | undefined;
  loading: boolean;
};
export default function ProjectEditView({ record, loading }: Props) {
  return (
    <MainContent>
      <CustomBreadcrumbs
        heading="Cập nhật dự án"
        links={[
          { name: 'Dự án của tôi', href: paths.project.root },
          { name: record?.name || 'Cập nhật dự án' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProjectNewEditForm currentRecord={record} loading={loading} />
    </MainContent>
  );
}
