import { paths } from 'src/routes/paths';

import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  serverUrl: string;
  assetsDir: string;
  isStaticExport: boolean;
  xApiKey: string;
  auth: {
    method: 'jwt';
    skip: boolean;
    redirectPath: string;
    defaultAccount: {
      username: string;
      password: string;
    };
  };
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'Blue Projects',
  appVersion: packageJson.version,
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? '',
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? '',
  isStaticExport: JSON.parse(`${process.env.BUILD_STATIC_EXPORT}`),
  xApiKey: process.env.NEXT_PUBLIC_X_API_KEY ?? '',
  /**
   * Auth
   * @method jwt
   */
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: paths.root,
    defaultAccount: {
      username: process.env.NEXT_PUBLIC_DEFAULT_USERNAME ?? '',
      password: process.env.NEXT_PUBLIC_DEFAULT_PASSWORD ?? '',
    },
  },
};
