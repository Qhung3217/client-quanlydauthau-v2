import { CONFIG } from 'src/global-config';

import RoleCreateView from 'src/sections/role/view/role-create-view';

// ----------------------------------------------------------------------
export const metadata = { title: `Thêm nhóm quyền mới - ${CONFIG.appName}` };

export default function Page() {
  return <RoleCreateView />;
}
