import { CONFIG } from 'src/global-config';

import PriorityListView from 'src/sections/priority/view/priority-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Danh sách độ ưu tiên - ${CONFIG.appName}` };
export default function Page() {
  return <PriorityListView />;
}
