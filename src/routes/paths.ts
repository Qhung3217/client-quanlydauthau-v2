// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/sign-in`,
    },
  },
  // MAIN
  root: '/',

  role: {
    root: `/role`,
    new: `/role/new`,
    edit: (id: any) => `/role/${id}/edit`,
  },
  organization: {
    root: `/organization`,
    new: `/organization/new`,
    edit: (id: any) => `/organization/${id}/edit`,
  },
  ticket: {
    root: `/ticket`,
    details: (id: any) => `/ticket/${id}`,
  },
  user: {
    root: `/user`,
    new: `/user/new`,
    edit: (id: any) => `/user/${id}/edit`,
  },
  product: {
    root: `/product`,
    new: `/product/new`,
    edit: (id: any) => `/product/${id}/edit`,
  },
  project: {
    root: `/project`,
    new: `/project/new`,
    edit: (id: any) => `/project/${id}/edit`,
    estimate: (id: any) => `/project/${id}/estimate`,
    view_estimate: (id: any) => `/project/${id}/view`,
    details: (id: any) => `/project/${id}`,
  },
  priority: {
    root: `/priority`,
  },
  estimate: {
    root: `/estimate`,
    new: `/estimate/new`,
    edit: (id: any) => `/estimate/${id}/edit`,
    estimate: (id: any) => `/estimate/${id}/estimate`,
    details: (id: any) => `/estimate/${id}`,
  },
  profile: {
    change_password: `/profile/change-password`,
    me: `/profile/me`,
  },
};
