import { CONFIG } from 'src/global-config';

export const metadata = { title: `Điều chỉnh dự toán - ${CONFIG.appName}` };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
