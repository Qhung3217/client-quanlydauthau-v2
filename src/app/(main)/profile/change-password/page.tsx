import { CONFIG } from 'src/global-config';

import ChangePasswordView from 'src/sections/profile/view/change-password-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Đổi mật khẩu - ${CONFIG.appName}` };

export default function Page() {
  return <ChangePasswordView />;
}
