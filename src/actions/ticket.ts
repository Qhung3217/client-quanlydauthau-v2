'use client';

import type { SWRConfiguration } from 'swr';
import type { IReqSearchParams } from 'src/types/request';
import type { Ticket, TicketComment } from 'src/types/ticket';
import type { IApiListResponse, IApiGetOneResponse } from 'src/types/response';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------
const ENDPOINT = endpoints.ticket;

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
export type TicketRes = IApiListResponse<Ticket[]>;

export function useGetTickets(params?: IReqSearchParams) {
  const url = [ENDPOINT.list, { params }];

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: APIMutate,
  } = useSWR<TicketRes>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      tickets: data?.response?.data || [],
      ticketsMeta: data?.response?.meta,
      ticketsLoading: isLoading,
      ticketsError: error,
      ticketsValidating: isValidating,
      ticketsEmpty: !isLoading && !isValidating && !data?.response?.data.length,
      ticketsMutate: APIMutate,
    }),
    [data?.response?.data, data?.response?.meta, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}
// ----------------------------------------------------------------------
export type TicketCommentRes = IApiListResponse<TicketComment[]>;

export function useGetTicketComments(id: string) {
  const url = id ? ENDPOINT.get_comments(id) : '';

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: APIMutate,
  } = useSWR<TicketCommentRes>(url, fetcher, {
    revalidateOnMount: true,
    revalidateIfStale: true,
  });

  const memoizedValue = useMemo(
    () => ({
      ticketComments: data?.response?.data || [],
      ticketCommentsLoading: isLoading,
      ticketCommentsEmpty: !isLoading && !isValidating && !data?.response?.data.length,
      ticketCommentsError: error,
      ticketCommentsValidating: isValidating,
      ticketCommentsMutate: APIMutate,
    }),
    [data?.response, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}
// ----------------------------------------------------------------------

export function useGetTicket(id: string) {
  const url = id ? ENDPOINT.details(id) : '';

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: APIMutate,
  } = useSWR<IApiGetOneResponse<Ticket>>(url, fetcher, {
    revalidateOnMount: true,
    revalidateIfStale: true,
  });

  const memoizedValue = useMemo(
    () => ({
      ticket: data?.response,
      ticketLoading: isLoading,
      ticketEmpty: !isLoading && !isValidating && !data?.response?.id,
      ticketError: error,
      ticketValidating: isValidating,
      ticketMutate: APIMutate,
    }),
    [data?.response, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}
