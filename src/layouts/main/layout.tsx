'use client';

import type { Breakpoint } from '@mui/material/styles';
import type { NavSectionProps } from 'src/components/nav-section';

import { merge } from 'es-toolkit';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { Label } from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';
import { Walktour, useWalktour } from 'src/components/walktour';

import { NavMobile } from './nav-mobile';
import { NavVertical } from './nav-vertical';
import { layoutClasses } from '../core/classes';
import { _account } from '../nav-config-account';
import { mainNavData } from '../nav-config-main';
import { MainSection } from '../core/main-section';
import { Searchbar } from '../components/searchbar';
import { MenuButton } from '../components/menu-button';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';
import { AccountDrawer } from '../components/account-drawer';
import { mainLayoutVars, mainNavColorVars } from './css-vars';

import type { MainSectionProps } from '../core/main-section';
import type { HeaderSectionProps } from '../core/header-section';
import type { LayoutSectionProps } from '../core/layout-section';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type MainLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    nav?: {
      data?: NavSectionProps['data'];
    };
    main?: MainSectionProps;
  };
};

export function MainLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'lg',
}: MainLayoutProps) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const navVars = mainNavColorVars(theme, settings.state.navColor, settings.state.navLayout);

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const navData = slotProps?.nav?.data ?? mainNavData;

  const isNavMini = settings.state.navLayout === 'mini';
  const isNavVertical = isNavMini || settings.state.navLayout === 'vertical';

  const walktour = useWalktour({
    defaultRun: true,

    steps: [
      {
        target: 'body',
        title: `Hãy bắt đầu cuộc hành trình của chúng ta!`,
        placement: 'center',
        hideCloseButton: true,
        content: (
          <Typography sx={{ color: 'text.secondary' }}>
            Chào mừng bạn đến với phần mềm đấu thầu, cùng đi qua sơ lược những tính năng chính nhé!
          </Typography>
        ),
      },
      {
        target: `a[href="${paths.project.root}/"]`,
        title: 'Chức năng quản lý dự án',
        placement: 'left-start',
        content: (
          <>
            <Typography sx={{ color: 'text.secondary' }}>
              Bạn có thể đăng tải dự án mới, quản lý dự án đã tạo, xem thông tin chi tiết của dự án.
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Bạn có thể duyệt dứ án, hủy dự án nếu được cấp quyền.
            </Typography>
          </>
        ),
      },
      {
        target: `a[href="${paths.estimate.root}/"]`,
        title: 'Chức năng quản lý dự toán',
        placement: 'bottom',
        content: (
          <Typography sx={{ color: 'text.secondary' }}>
            Ở đây bạn có thể xem lại hoặc điều chỉnh các dự toán của mình.
          </Typography>
        ),
      },
      {
        target: `a[href="${paths.product.root}/"]`,
        title: 'Chức năng quản lý sản phẩm',
        placement: 'left',
        content: (
          <Stack spacing={3}>
            <Typography sx={{ color: 'text.secondary' }}>
              Tại đây bạn có thể tạo sản phẩm của mình và sử dụng cho việc thêm nhanh sản phẩm vào
              dự toán.
            </Typography>
          </Stack>
        ),
      },
      {
        target: 'a[href="/priority/"]',
        title: 'Quản lý độ ưu tiên',
        placement: 'left',
        styles: { options: { arrowColor: theme.vars.palette.grey[800] } },
        slotProps: {
          root: {
            sx: {
              width: 480,
            },
          },
        },
        content: (
          <Stack spacing={2}>
            <Typography sx={{ color: 'text.secondary' }}>
              Tại đây bạn có thể thêm độ ưu tiên để phân loại mức độ quan trọng của dự án. Có thể
              tùy chỉnh màu sắc, tên độ ưu tiên.
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Ví dụ:</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Label color="error">Cao</Label>
              <Label color="warning">Trung bình</Label>
              <Label color="info">Thấp</Label>
            </Box>
          </Stack>
        ),
      },
      {
        target: `a[href="${paths.user.root}/"]`,
        title: 'Quản lý người dùng',
        placement: 'left',
        styles: { options: { arrowColor: theme.vars.palette.grey[800] } },
        slotProps: {
          root: {
            sx: {
              width: 480,
            },
          },
        },
        content: (
          <Stack spacing={2}>
            <Typography sx={{ color: 'text.secondary' }}>
              Tại đây bạn có thể thêm người dùng mới và phân quyền cho họ. Những tài khoản được phân
              quyền chỉ được thao tác các chức năng trong phạm vi cho phép.
            </Typography>
          </Stack>
        ),
      },
      {
        target: `a[href="${paths.organization.root}/"]`,
        title: 'Quản lý thông tin đơn vị',
        placement: 'left',
        styles: { options: { arrowColor: theme.vars.palette.grey[800] } },
        slotProps: {
          root: {
            sx: {
              width: 480,
            },
          },
        },
        content: (
          <Stack spacing={2}>
            <Typography sx={{ color: 'text.secondary' }}>
              Bạn có thể xem danh sách các đơn vị tại đây.
            </Typography>
          </Stack>
        ),
      },
      {
        target: `a[href="${paths.role.root}/"]`,
        title: 'Quản lý phân quyền',
        placement: 'left',
        styles: { options: { arrowColor: theme.vars.palette.grey[800] } },
        slotProps: {
          root: {
            sx: {
              width: 480,
            },
          },
        },
        content: (
          <Stack spacing={2}>
            <Typography sx={{ color: 'text.secondary' }}>
              Bạn có thể thêm mới quyền hạn hoặc phân quyền cho nhóm người dùng tại đây. Những người
              dùng được phân quyền chỉ được thao tác các chức năng trong phạm vi cho phép.
            </Typography>
          </Stack>
        ),
      },
      {
        target: '#account-button',
        title: 'Hồ sơ của bạn',
        placement: 'right',
        styles: { options: { arrowColor: theme.vars.palette.grey[800] } },
        slotProps: {
          root: {
            sx: {
              width: 480,
            },
          },
        },
        content: (
          <Stack spacing={1}>
            <Typography sx={{ color: 'text.secondary' }}>
              Xem lại hoặc điều chỉnh thông tin cá nhân tại đây.
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Bạn có thể đổi mật khẩu hoặc đăng xuất khỏi hệ thống.
            </Typography>
          </Stack>
        ),
      },
    ],
  });

  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = {
      container: {
        maxWidth: false,
        sx: {
          ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
        },
      },
    };

    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={{ mr: 1, ml: -1, [theme.breakpoints.up(layoutQuery)]: { display: 'none' } }}
          />
          <NavMobile
            data={navData}
            open={open}
            onClose={onClose}
            cssVars={navVars.section}
            sx={{
              backgroundColor: '#fbfcfe',
            }}
          />
        </>
      ),
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.75 } }}>
          {/** @slot Searchbar */}
          <Searchbar data={navData} />

          {/** @slot Account drawer */}
          <AccountDrawer data={_account} />
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        disableElevation={isNavVertical}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderSidebar = () => (
    <NavVertical
      data={navData}
      isNavMini={isNavMini}
      layoutQuery={layoutQuery}
      cssVars={navVars.section}
      sx={{
        backgroundColor: '#fbfcfe',
      }}
      onToggleNav={() =>
        settings.setField(
          'navLayout',
          settings.state.navLayout === 'vertical' ? 'mini' : 'vertical'
        )
      }
    />
  );

  const renderFooter = () => null;

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Sidebar
       *************************************** */
      sidebarSection={renderSidebar()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ ...mainLayoutVars(theme), ...navVars.layout, ...cssVars }}
      sx={[
        {
          [`& .${layoutClasses.sidebarContainer}`]: {
            [theme.breakpoints.up(layoutQuery)]: {
              pl: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
              transition: theme.transitions.create(['padding-left'], {
                easing: 'var(--layout-transition-easing)',
                duration: 'var(--layout-transition-duration)',
              }),
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {renderMain()}

      <Walktour
        run={walktour.run}
        steps={walktour.steps}
        callback={walktour.onCallback}
        getHelpers={walktour.setHelpers}
        disableScrolling
      />
    </LayoutSection>
  );
}
