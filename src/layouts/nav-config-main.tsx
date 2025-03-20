import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';
import { PERMISSION_ENUM } from 'src/constants/permission';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const mainNavData: NavSectionProps['data'] = [
  /**
   * PROJECT
   */
  {
    subheader: 'Dự án',
    items: [
      {
        title: 'Tất cả dự án',
        path: paths.project.root,
        icon: ICONS.folder,
        roles: [PERMISSION_ENUM.VIEW_PROJECT],
      },
      {
        title: 'Tất cả dự toán',
        path: paths.estimate.root,
        icon: ICONS.file,
        roles: [PERMISSION_ENUM.VIEW_ESTIMATE],
      },
      // {
      //   title: 'Báo giá của tôi',
      //   path: paths.dashboard.quotation.root,
      //   icon: ICONS.file,
      //   roles: [PERMISSION_ENUM.VIEW_QUOTATION],
      // },
      {
        title: 'Sản phẩm',
        path: paths.product.root,
        roles: [PERMISSION_ENUM.VIEW_PRODUCT],
        icon: ICONS.product,
      },
      {
        title: 'Độ ưu tiên',
        path: paths.priority.root,
        roles: [PERMISSION_ENUM.VIEW_PRIORITY],
        icon: ICONS.parameter,
      },
    ],
  },
  /**
   * Admin
   */
  {
    subheader: 'Quản trị',

    items: [
      // {
      //   // default roles : All roles can see this entry.
      //   // roles: ['user'] Only users can see this item.
      //   // roles: ['admin'] Only admin can see this item.
      //   // roles: ['admin', 'manager'] Only admin/manager can see this item.
      //   // Reference from 'src/guards/RoleBasedGuard'.
      //   title: 'Quản lý dự án',
      //   path: paths.dashboard.review_project.root,
      //   icon: ICONS.course,
      //   roles: [PERMISSION_ENUM.ADMIN_VIEW_PROJECT],
      // },
      // {
      //   title: 'Duyệt báo giá',
      //   path: paths.dashboard.review_quotation.root,
      //   icon: ICONS.blog,
      //   roles: [PERMISSION_ENUM.ADMIN_VIEW_QUOTATION],
      // },
      {
        title: 'Tài khoản',
        path: paths.user.root,
        icon: ICONS.user,
        roles: [PERMISSION_ENUM.VIEW_USER],
      },
      {
        title: 'Thông tin đơn vị',
        path: paths.organization.root,
        icon: ICONS.job,
        roles: [PERMISSION_ENUM.VIEW_COMPANY],
      },
      {
        title: 'Phân quyền',
        path: paths.role.root,
        icon: ICONS.lock,
        roles: [PERMISSION_ENUM.VIEW_ROLE],
      },
    ],
  },
  // {
  //   subheader: 'Hỗ trợ',
  //   items: [
  //     {
  //       title: 'Ticket',
  //       path: paths.ticket.root,
  //       icon: ICONS.chat,
  //       roles: [PERMISSION_ENUM.VIEW_TICKET],
  //     },
  //   ],
  // },
];
