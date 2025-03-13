export type Company = {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  tax: string;
  website: string;
  logo: string;
  representativeName: string;
  representativePosition: string;
  updatedAt: Date;
  createdAt: Date;
};

export type CompanyBasic = {
  id: string;
  name: string;
  phone: string;
  logo: string;
};
