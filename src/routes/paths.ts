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
    edit: (id: string) => `/role/${id}/edit`,
  },
  organization: {
    root: `/organization`,
    new: `/organization/new`,
    edit: (id: string) => `/organization/${id}/edit`,
  },
  user: {
    root: `/user`,
    new: `/user/new`,
    edit: (id: string) => `/user/${id}/edit`,
  },
  product: {
    root: `/product`,
    new: `/product/new`,
    edit: (id: string) => `/product/${id}/edit`,
  },
  priority: {
    root: `/priority`,
  },
};
