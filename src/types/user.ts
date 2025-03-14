import type { CompanyBasic } from './company';

export type UserStatus = 'ACTIVE' | 'BLOCKED';

export type User = {
  id: string;
  name: string;
  username: string;
  status: UserStatus;
  email: any;
  phone: any;
  avatar: any;
  address: any;
  updatedAt: string;
  role: {
    id: string;
    name: string;
  };
  company: {
    id: string;
    name: string;
    phone: string;
    logo: string;
  };
};

export type Creator = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  email: string;
  phone: string;
  address: string;
  company: CompanyBasic;
};

export type UserBasic = {
  id: string;
  name: string;
  phone: string;
  avatar: string;
};
