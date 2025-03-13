import { CONFIG } from 'src/global-config';

import ProductCreateView from 'src/sections/product/view/product-create-view';

// ----------------------------------------------------------------------
export const metadata = { title: `Thêm sản phẩm mới - ${CONFIG.appName}` };

export default function Page() {
  return <ProductCreateView />;
}
