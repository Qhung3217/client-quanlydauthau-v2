import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  headers: {
    'X-Api-Key': CONFIG.xApiKey,
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/auth/get-me',
    login: '/auth/login',
    refreshToken: '/auth/refresh-token',
  },
  company: {
    list: '/company',
    create: '/company',
    update: (id: any) => `/company/${id}`,
    details: (id: any) => `/company/${id}`,
    delete_one: (id: any) => `/company/${id}`,
    delete_many: '/company',
  },
  product: {
    list: '/product',
    create: '/product',
    update: (id: any) => `/product/${id}`,
    details: (id: any) => `/product/${id}`,
    delete_one: (id: any) => `/product/${id}`,
    delete_many: '/product',
  },
  user: {
    list: '/user',
    create: '/user',
    update: (id: any) => `/user/${id}`,
    details: (id: any) => `/user/${id}`,
    delete_one: (id: any) => `/user/${id}`,
    delete_many: '/user',
    reset_password: (id: any) => `/user/change-password/${id}`,
  },
  media: {
    upload_one: '/media/upload-file',
    upload_many: '/media/upload-files',
  },
  permission: {
    get_all: '/permission',
    get_all_by_group: '/permission-group',
  },
  role: {
    list: '/role',
    create: '/role',
    update: (id: any) => `/role/${id}`,
    details: (id: any) => `/role/${id}`,
    delete_one: (id: any) => `/role/${id}`,
    delete_many: '/role',
  },
  priority: {
    list: '/priority',
    create: '/priority',
    update: (id: any) => `/priority/${id}`,
    details: (id: any) => `/priority/${id}`,
    delete_one: (id: any) => `/priority/${id}`,
    delete_many: '/priority',
  },
  project: {
    list: '/project',
    create: '/project',
    update: (id: any) => `/project/${id}`,
    details: (id: any) => `/project/${id}`,
    delete_one: (id: any) => `/project/${id}`,
    delete_many: '/project',
    approve: (id: any) => `/project/${id}/approve`,
    reject: (id: any) => `/project/${id}/cancel`,
    request_edit: (id: any) => `/project/${id}/request-edit`,
  },
};
