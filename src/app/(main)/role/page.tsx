import { CONFIG } from 'src/global-config';

import RoleListView from 'src/sections/role/view/role-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Danh sách nhóm quyền - ${CONFIG.appName}` };

export default function Page() {
  return <RoleListView />;
}
