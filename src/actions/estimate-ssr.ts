import { mutate } from 'swr';

import axios, { endpoints } from 'src/lib/axios';

import type { EstimatesRes } from './estimate';

// ----------------------------------------------------------------------
const ENDPOINT = endpoints.estimate;

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
type CreatePayload = {
  name: string;

  desc?: string;
  thumb?: string;
};
export async function createEstimate(payload: CreatePayload) {
  /**
   * Work on server
   */

  const { data } = await axios.post(ENDPOINT.create, payload);

  /**
   * Work in local
   */

  mutate(
    (key) => Array.isArray(key) && key[0] === ENDPOINT.list,
    (resCache: EstimatesRes | any) => {
      const currentData = resCache.response.data;

      return {
        ...resCache,
        response: { ...resCache.response, data: [data.response, ...currentData] },
      };
    },
    false
  );

  mutate((key) => Array.isArray(key) && key[0] === endpoints.project.list, undefined, true);
}

// ----------------------------------------------------------------------
type UpdatePayload = Partial<CreatePayload>;

export async function updateEstimate(id: string, payload: UpdatePayload) {
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

export async function deleteEstimate(id: string) {
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
    (resCache: EstimatesRes | any) => {
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

export async function deleteEstimates(ids: string[]) {
  /**
   * Work on server
   */
  await axios.delete(ENDPOINT.delete_many, { data: { ids } });

  /**
   * Work in local
   */

  mutate(
    (key) => Array.isArray(key) && key[0] === ENDPOINT.list,
    (resCache: EstimatesRes | any) => {
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
