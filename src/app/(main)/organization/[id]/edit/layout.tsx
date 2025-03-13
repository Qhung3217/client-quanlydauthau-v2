import { Suspense } from 'react';

import { CONFIG } from 'src/global-config';

import { LoadingScreen } from 'src/components/loading-screen';

export const metadata = { title: `Cập nhật nhóm quyền - ${CONFIG.appName}` };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingScreen />}> {children}</Suspense>;
}
