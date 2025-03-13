import { CONFIG } from 'src/global-config';

import UserCreateView from 'src/sections/user/view/user-create-view';

// ----------------------------------------------------------------------
export const metadata = { title: `Thêm tài khoản mới - ${CONFIG.appName}` };

export default function Page() {
  return <UserCreateView />;
}
