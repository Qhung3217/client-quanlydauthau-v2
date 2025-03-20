import { mutate } from 'swr';

import axios, { endpoints } from 'src/lib/axios';

import type { EstimatesRes } from './estimate';

// ----------------------------------------------------------------------
const ENDPOINT = endpoints.estimate;
const PROJECT_ENDPOINT = endpoints.project;

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

  mutate(
    (key) => (Array.isArray(key) && key[0] === PROJECT_ENDPOINT.list) || (Array.isArray(key) && key[0] === PROJECT_ENDPOINT.list),
    undefined,
    true
  );
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

  mutate(
    (key) => (Array.isArray(key) && key[0] === ENDPOINT.list) || key === ENDPOINT.details(id) || (Array.isArray(key) && key[0] === PROJECT_ENDPOINT.list),
    undefined,
    true
  );
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

  mutate(
    (key) => (Array.isArray(key) && key[0] === PROJECT_ENDPOINT.list),
    undefined,
    true
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

  mutate(
    (key) => (Array.isArray(key) && key[0] === PROJECT_ENDPOINT.list),
    undefined,
    true
  );
}
// ----------------------------------------------------------------------

export async function approveEstimate(id: string) {
  /**
   * Work on server
   */

  await axios.patch(ENDPOINT.approve(id));

  /**
   * Work in local
   */
  mutate(
    (key) => (Array.isArray(key) && key[0] === ENDPOINT.list) || key === ENDPOINT.details(id) || (typeof key === 'string' && key.startsWith(PROJECT_ENDPOINT.list)),
    undefined,
    true
  );
}
// ----------------------------------------------------------------------

export async function rejectEstimate(id: string) {
  /**
   * Work on server
   */

  await axios.patch(ENDPOINT.reject(id));

  /**
   * Work in local
   */
  mutate(
    (key) => (Array.isArray(key) && key[0] === ENDPOINT.list) || key === ENDPOINT.details(id) || (typeof key === 'string' && key.startsWith(PROJECT_ENDPOINT.list)),
    undefined,
    true
  );

}
// ----------------------------------------------------------------------

export async function requestEditEstimate(id: string) {
  /**
   * Work on server
   */

  await axios.patch(ENDPOINT.request_edit(id));

  /**
   * Work in local
   */
  mutate(
    (key) => (Array.isArray(key) && key[0] === ENDPOINT.list) || key === ENDPOINT.details(id) || (typeof key === 'string' && key.startsWith(PROJECT_ENDPOINT.list)),
    undefined,
    true
  );


}
