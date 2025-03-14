'use client';

import type { SWRConfiguration } from 'swr';
import type { Priority } from 'src/types/priority';
import type { IReqSearchParams } from 'src/types/request';
import type { IApiListResponse, IApiGetOneResponse } from 'src/types/response';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------
const ENDPOINT = endpoints.priority;

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
export type IPrioritiesRes = IApiListResponse<Priority[]>;
export function useGetPriorities(params?: IReqSearchParams) {
  const url = [ENDPOINT.list, { params }];

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: APIMutate,
  } = useSWR<IPrioritiesRes>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      priorities: data?.response?.data || [],
      prioritiesMeta: data?.response?.meta,
      prioritiesLoading: isLoading,
      prioritiesError: error,
      prioritiesValidating: isValidating,
      prioritiesEmpty: !isLoading && !isValidating && !data?.response?.data.length,
      prioritiesMutate: APIMutate,
    }),
    [data?.response?.data, data?.response?.meta, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetPriority(id: string) {
  const url = id ? ENDPOINT.details(id) : '';

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: APIMutate,
  } = useSWR<IApiGetOneResponse<Priority>>(url, fetcher, {
    revalidateOnMount: true,
    revalidateIfStale: true,
  });

  const memoizedValue = useMemo(
    () => ({
      priority: data?.response,
      priorityLoading: isLoading,
      priorityEmpty: !isLoading && !isValidating && !data?.response?.id,
      priorityError: error,
      priorityValidating: isValidating,
      priorityMutate: APIMutate,
    }),
    [data?.response, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}
