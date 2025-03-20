'use client';

import { usePathname } from 'next/navigation';
import { removeLastSlash } from 'minimal-shared/utils';

import { Tab, Tabs, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { MainContent } from 'src/layouts/main';
import { PERMISSION_ENUM } from 'src/constants/permission';

import { Iconify } from 'src/components/iconify';

import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------
type Props = {
  children: React.ReactNode;
};

const NAV_ITEMS = [
  {
    label: 'Hồ sơ của tôi',
    icon: <Iconify width={24} icon="solar:user-id-bold" />,
    href: paths.profile.me,
  },

  {
    label: 'Đổi mật khẩu',
    icon: <Iconify width={24} icon="ic:round-vpn-key" />,
    href: paths.profile.change_password,
  },
];

export default function Layout({ children }: Props) {
  const { user } = useAuthContext();
  const pathname = usePathname();

  return (
    <RoleBasedGuard
      acceptRoles={[PERMISSION_ENUM.CHANGE_MY_PASSWORD, PERMISSION_ENUM.UPDATE_MY_PROFILE]}
      currentRole={user?.permissions}
      hasContent
    >
      <MainContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Đổi mật khẩu
        </Typography>
        <Tabs value={removeLastSlash(pathname)} sx={{ mb: { xs: 3, md: 5 } }}>
          {NAV_ITEMS.map((tab) => (
            <Tab
              component={RouterLink}
              key={tab.href}
              label={tab.label}
              icon={tab.icon}
              value={tab.href}
              href={tab.href}
            />
          ))}
        </Tabs>
        {children}
      </MainContent>
    </RoleBasedGuard>
  );
}
