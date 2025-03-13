import { mutate } from 'swr';

import axios, { endpoints } from 'src/lib/axios';

import type { ICompaniesRes } from './company';

// ----------------------------------------------------------------------

const ENDPOINT = endpoints.company;
// ----------------------------------------------------------------------
type CreatePayload = {
  name: string;
  email: string;
  phone: string;
  address: string;
  tax: string;
  website?: string;
  logo: string;
  representativeName: string;
  representativePosition: string;
};
export async function createCompany(payload: CreatePayload) {
  /**
   * Work on server
   */

  const { email, ...bodyWithoutEmail } = payload;

  await axios.post(ENDPOINT.create, {
    ...bodyWithoutEmail,
    ...(!!email && { email }),
  });

  /**
   * Revalidate cache
   */
  mutate((key) => Array.isArray(key) && key[0] === ENDPOINT.list, undefined, false);
}

// ----------------------------------------------------------------------
type UpdatePayload = Partial<CreatePayload>;

export async function updateCompany(id: string, payload: UpdatePayload) {
  /**
   * Work on server
   */
  const { email, ...bodyWithoutEmail } = payload;

  await axios.patch(ENDPOINT.update(id), {
    ...bodyWithoutEmail,
    ...(!!email && { email }),
  });

  /**
   * Work in local
   */
  mutate(
    (key) => (Array.isArray(key) && key[0] === ENDPOINT.list) || key === ENDPOINT.details(id),
    undefined,
    true
  );
}

// ----------------------------------------------------------------------

export async function deleteCompany(id: string) {
  /**
   * Work on server
   */
  const url = id ? ENDPOINT.delete_one(id) : '';
  await axios.delete(url);

  /**
   * Work in local
   */

  mutate(
    (key) => Array.isArray(key) && key[0] === ENDPOINT.list,
    (resCache: ICompaniesRes | any) => {
      const currentData = resCache.response.data;

      return {
        ...resCache,
        response: {
          ...resCache.response,
          data: currentData.filter((data: any) => data.id !== id),
        },
      };
    },
    false
  );
}
// ----------------------------------------------------------------------

export async function deleteCompanies(ids: string[]) {
  /**
   * Work on server
   */
  await axios.delete(ENDPOINT.delete_many, { data: { ids } });

  /**
   * Work in local
   */

  mutate(
    (key) => Array.isArray(key) && key[0] === ENDPOINT.list,
    (resCache: ICompaniesRes | any) => {
      const currentData = resCache.response.data;

      return {
        ...resCache,
        response: {
          ...resCache.response,
          data: currentData.filter((data: any) => !ids.includes(data.id)),
        },
      };
    },
    false
  );
}
