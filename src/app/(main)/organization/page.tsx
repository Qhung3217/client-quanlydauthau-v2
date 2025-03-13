import { CONFIG } from 'src/global-config';

import CompanyListView from 'src/sections/company/view/company-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Danh sách thông tin đơn vị - ${CONFIG.appName}` };

export default function Page() {
  return <CompanyListView />;
}
