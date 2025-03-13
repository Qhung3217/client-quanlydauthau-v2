import { mutate } from 'swr';

import axios, { endpoints } from 'src/lib/axios';

import type { IProductsRes } from './product';

// ----------------------------------------------------------------------
const ENDPOINT = endpoints.product;

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
type CreatePayload = {
  name: string;

  desc?: string;
  thumb?: string;
};
export async function createProduct(payload: CreatePayload) {
  /**
   * Work on server
   */

  const { data } = await axios.post(ENDPOINT.create, payload);

  /**
   * Work in local
   */

  mutate(
    (key) => Array.isArray(key) && key[0] === ENDPOINT.list,
    (resCache: IProductsRes | any) => {
      const currentData = resCache.response.data;

      return {
        ...resCache,
        response: { ...resCache.response, data: [data.response, ...currentData] },
      };
    },
    false
  );
}

// ----------------------------------------------------------------------
type UpdatePayload = Partial<CreatePayload>;

export async function updateProduct(id: string, payload: UpdatePayload) {
  /**
   * Work on server
   */

  await axios.patch(ENDPOINT.update(id), payload);

  /**
   * Work in local
   */

  mutate((key) => Array.isArray(key) && key[0] === ENDPOINT.list, undefined, true);
}

// ----------------------------------------------------------------------

export async function deleteProduct(id: string) {
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
    (resCache: IProductsRes | any) => {
      const currentData = resCache.response.data;

      return {
        ...resCache,
        response: { ...resCache.response, data: currentData.filter((data: any) => data.id !== id) },
      };
    },
    false
  );
}
// ----------------------------------------------------------------------

export async function deleteProducts(ids: string[]) {
  /**
   * Work on server
   */
  await axios.delete(ENDPOINT.delete_many, { data: { ids } });

  /**
   * Work in local
   */

  mutate(
    (key) => Array.isArray(key) && key[0] === ENDPOINT.list,
    (resCache: IProductsRes | any) => {
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
