import { mutate } from 'swr';

import axios, { endpoints } from 'src/lib/axios';

import type { IRolesRes } from './role';

// ----------------------------------------------------------------------

const ENDPOINT = endpoints.role;
// ----------------------------------------------------------------------
type CreatePayload = {
  name: string;
  permissionCodes: string[];
};
export async function createRole(payload: CreatePayload) {
  /**
   * Work on server
   */

  await axios.post(ENDPOINT.create, payload);

  /**
   * Work in local
   */
  mutate((key) => Array.isArray(key) && key[0] === ENDPOINT.list, undefined, true);
}

// ----------------------------------------------------------------------
type UpdatePayload = Partial<CreatePayload>;

export async function updateRole(id: string, payload: UpdatePayload) {
  /**
   * Work on server
   */

  await axios.patch(ENDPOINT.update(id), payload);

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

export async function deleteRole(id: string) {
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
    (resCache: IRolesRes | any) => {
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

export async function deleteRoles(ids: string[]) {
  /**
   * Work on server
   */
  await axios.delete(ENDPOINT.delete_many, { data: { ids } });

  /**
   * Work in local
   */
  mutate(
    (key) => Array.isArray(key) && key[0] === ENDPOINT.list,
    (resCache: IRolesRes | any) => {
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
