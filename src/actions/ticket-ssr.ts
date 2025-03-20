import type { TicketStatus } from 'src/types/ticket';

import { mutate } from 'swr';

import axios, { endpoints } from 'src/lib/axios';

import type { TicketCommentRes } from './ticket';

// ----------------------------------------------------------------------

const ENDPOINT = endpoints.ticket;
// ----------------------------------------------------------------------
type CreatePayload = {
  title: string;
  type: string;
  content: string;
  assignee: string;
  projectId: string;
};
export async function createTicket(payload: CreatePayload) {
  /**
   * Work on server
   */

  const { data } = await axios.post(ENDPOINT.create, payload);

  /**
   * Work in local
   */
  mutate(
    (key) => Array.isArray(key) && key[0] === ENDPOINT.list,
    (resCache: TicketCommentRes | any) => {
      const currentData = resCache.response.data;

      return {
        ...resCache,
        response: {
          ...resCache.response,
          data: [data.response, ...currentData],
        },
      };
    },
    false
  );
}

// ----------------------------------------------------------------------
type CreateCommentPayload = {
  content: string;
};
export async function createTicketComment(id: string, payload: CreateCommentPayload) {
  const url = id ? ENDPOINT.create_comment(id) : '';

  /**
   * Work on server
   */

  const { data } = await axios.post(url, payload);

  /**
   * Work in local
   */
  mutate(
    (key) => key === ENDPOINT.get_comments(id),
    (resCache: TicketCommentRes | any) => {
      const currentData = resCache.response.data;

      return {
        ...resCache,
        response: {
          ...resCache.response,
          data: [...currentData, data.response],
        },
      };
    },
    false
  );
}
// ----------------------------------------------------------------------
type UpdateTicketPayload = {
  status?: TicketStatus;
};
export async function updateTicket(id: string, payload: UpdateTicketPayload) {
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
