import { CONFIG } from 'src/global-config';

import UserListView from 'src/sections/user/view/user-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Danh sách tài khoản - ${CONFIG.appName}` };

export default function Page() {
  return <UserListView />;
}
