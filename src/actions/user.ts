'use client';

import type { User } from 'src/types/user';
import type { SWRConfiguration } from 'swr';
import type { IReqSearchParams } from 'src/types/request';
import type { IApiListResponse, IApiGetOneResponse } from 'src/types/response';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------
const ENDPOINT = endpoints.user;

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
export type IUsersRes = IApiListResponse<User[]>;
export function useGetUsers(params?: IReqSearchParams) {
  const url = [ENDPOINT.list, { params }];

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: APIMutate,
  } = useSWR<IUsersRes>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      users: data?.response?.data || [],
      usersMeta: data?.response?.meta,
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !isValidating && !data?.response?.data.length,
      usersMutate: APIMutate,
    }),
    [data?.response?.data, data?.response?.meta, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetUser(id: string) {
  const url = id ? ENDPOINT.details(id) : '';

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: APIMutate,
  } = useSWR<IApiGetOneResponse<User>>(url, fetcher, {
    revalidateOnMount: true,
    revalidateIfStale: true,
  });

  const memoizedValue = useMemo(
    () => ({
      user: data?.response,
      userLoading: isLoading,
      userEmpty: !isLoading && !isValidating && !data?.response?.id,
      userError: error,
      userValidating: isValidating,
      userMutate: APIMutate,
    }),
    [data?.response, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}
