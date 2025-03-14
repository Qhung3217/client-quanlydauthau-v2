import { mutate } from 'swr';

import axios, { endpoints } from 'src/lib/axios';

import type { IProjectsRes } from './project';

// ----------------------------------------------------------------------

const ENDPOINT = endpoints.project;
// ----------------------------------------------------------------------
type CreatePayload = {
  name: string;
  address: string;
  investorId: string;
  inviterId: string;
  priorityId: string;
  estDeadline: string;
  estimatorIds: string[];
};
export async function createProject(payload: CreatePayload) {
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

export async function updateProject(id: string, payload: UpdatePayload) {
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

export async function deleteProject(id: string) {
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
    (resCache: IProjectsRes | any) => {
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

export async function deleteProjects(ids: string[]) {
  /**
   * Work on server
   */
  await axios.delete(ENDPOINT.delete_many, { data: { ids } });

  /**
   * Work in local
   */
  mutate(
    (key) => Array.isArray(key) && key[0] === ENDPOINT.list,
    (resCache: IProjectsRes | any) => {
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

export async function approveProject(id: string) {
  /**
   * Work on server
   */

  await axios.patch(ENDPOINT.approve(id));

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

export async function requestEditProject(id: string) {
  /**
   * Work on server
   */

  await axios.patch(ENDPOINT.request_edit(id));

  /**
   * Work in local
   */
  mutate(
    (key) => (Array.isArray(key) && key[0] === ENDPOINT.list) || key === ENDPOINT.details(id),
    undefined,
    true
  );
}
