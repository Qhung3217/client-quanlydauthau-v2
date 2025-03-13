import { CONFIG } from 'src/global-config';

import ProductListView from 'src/sections/product/view/product-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Danh sách sản phẩm - ${CONFIG.appName}` };

export default function Page() {
  return <ProductListView />;
}
