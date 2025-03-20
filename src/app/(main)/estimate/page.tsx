import { CONFIG } from 'src/global-config';

import ProjectListView from 'src/sections/project/view/project-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Danh sách dự toán - ${CONFIG.appName}` };

export default function Page() {
  return <ProjectListView />;
}
