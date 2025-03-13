export type UserType = {
  id: string;
  name: string;
  username: string;
  status: string;
  email: any;
  phone: any;
  avatar: any;
  address: any;
  birthDate: any;
  company: any;
  updatedAt: string;
  ward: any;
  role: {
    id: string;
    name: string;
    permissions: Array<{
      code: string;
      name: string;
    }>;
  };
  permissions: string[];
  accessToken: string;
} | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
};
