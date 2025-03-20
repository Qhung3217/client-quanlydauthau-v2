import { CONFIG } from 'src/global-config';

import ProjectCreateView from 'src/sections/project/view/project-create-view';

// ----------------------------------------------------------------------
export const metadata = { title: `Thêm dự án mới - ${CONFIG.appName}` };

export default function Page() {
  return <ProjectCreateView />;
}
