import { CONFIG } from 'src/global-config';

import CompanyCreateView from 'src/sections/company/view/company-create-view';

// ----------------------------------------------------------------------
export const metadata = { title: `Thêm thông tin đơn vị mới - ${CONFIG.appName}` };

export default function Page() {
  return <CompanyCreateView />;
}
