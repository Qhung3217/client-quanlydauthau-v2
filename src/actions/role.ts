'use client';

import type { Role } from 'src/types/role';
import type { SWRConfiguration } from 'swr';
import type { IReqSearchParams } from 'src/types/request';
import type { IApiListResponse, IApiGetOneResponse } from 'src/types/response';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------
const ENDPOINT = endpoints.role;

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
export type IRolesRes = IApiListResponse<Role[]>;

export function useGetRoles(params?: IReqSearchParams) {
  const url = [ENDPOINT.list, { params }];

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: APIMutate,
  } = useSWR<IRolesRes>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      roles: data?.response?.data || [],
      rolesMeta: data?.response?.meta,
      rolesLoading: isLoading,
      rolesError: error,
      rolesValidating: isValidating,
      rolesEmpty: !isLoading && !isValidating && !data?.response?.data.length,
      rolesMutate: APIMutate,
    }),
    [data?.response?.data, data?.response?.meta, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetRole(id: string) {
  const url = id ? ENDPOINT.details(id) : '';

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: APIMutate,
  } = useSWR<IApiGetOneResponse<Role>>(url, fetcher, {
    revalidateOnMount: true,
    revalidateIfStale: true,
  });

  const memoizedValue = useMemo(
    () => ({
      role: data?.response,
      roleLoading: isLoading,
      roleEmpty: !isLoading && !isValidating && !data?.response?.id,
      roleError: error,
      roleValidating: isValidating,
      roleMutate: APIMutate,
    }),
    [data?.response, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}
