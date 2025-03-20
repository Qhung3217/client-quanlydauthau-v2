import { CONFIG } from 'src/global-config';

import ProfileView from 'src/sections/profile/view/profile-view';



// ----------------------------------------------------------------------

export const metadata = { title: `Đổi mật khẩu - ${CONFIG.appName}` };

export default function Page() {
  return <ProfileView />;
}
