import { CONFIG } from 'src/global-config';

import EstimateListView from 'src/sections/estimate/view/estimate-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Danh sách dự toán - ${CONFIG.appName}` };

export default function Page() {
  return <EstimateListView />;
}
