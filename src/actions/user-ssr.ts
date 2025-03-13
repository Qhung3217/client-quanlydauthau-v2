import { mutate } from 'swr';

import axios, { endpoints } from 'src/lib/axios';
import { USER_STATUS_OBJ } from 'src/constants/user';

import type { IUsersRes } from './user';

// ----------------------------------------------------------------------

const ENDPOINT = endpoints.user;
// ----------------------------------------------------------------------
type CreatePayload = {
  name: string;
  username: string;
  password: string;
  companyId: string;
  phone: string;
  roleId: string;

  birthDate?: string;
  email?: string;
  avatar?: string;
  address?: string;
  status?: boolean;
};
export async function createUser(payload: CreatePayload) {
  /**
   * Work on server
   */

  await axios.post(ENDPOINT.create, {
    ...payload,
    status: payload.status ? USER_STATUS_OBJ.ACTIVE : USER_STATUS_OBJ.BLOCKED,
  });

  /**
   * Work in local
   */
  mutate((key) => Array.isArray(key) && key[0] === ENDPOINT.list, undefined, false);
}

// ----------------------------------------------------------------------
type UpdatePayload = Partial<CreatePayload>;

export async function updateUser(id: string, payload: UpdatePayload) {
  /**
   * Work on server
   */

  await axios.patch(ENDPOINT.update(id), {
    ...payload,
    status: payload.status ? USER_STATUS_OBJ.ACTIVE : USER_STATUS_OBJ.BLOCKED,
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

export async function deleteUser(id: string) {
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
    (resCache: IUsersRes | any) => {
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

export async function deleteUsers(ids: string[]) {
  /**
   * Work on server
   */
  await axios.delete(ENDPOINT.delete_many, { data: { ids } });

  /**
   * Work in local
   */

  mutate(
    (key) => Array.isArray(key) && key[0] === ENDPOINT.list,
    (resCache: IUsersRes | any) => {
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
// ----------------------------------------------------------------------

export async function resetPassword(id: string, newPassword: string) {
  /**
   * Work on server
   */
  await axios.patch(ENDPOINT.reset_password(id), { password: newPassword });
}
