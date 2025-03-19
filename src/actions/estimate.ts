'use client';

import type { SWRConfiguration } from 'swr';
import type { IReqSearchParams } from 'src/types/request';
import type { Estimate, EstimateDetails } from 'src/types/estimate';
import type { IApiListResponse, IApiGetOneResponse } from 'src/types/response';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------
const ENDPOINT = endpoints.estimate;

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
export type EstimatesRes = IApiListResponse<Estimate[]>;

export function useGetEstimates(
  params?: IReqSearchParams & {
    projectId?: string;
  }
) {
  const url = [ENDPOINT.list, { params }];

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: APIMutate,
  } = useSWR<EstimatesRes>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      estimates: data?.response?.data || [],
      estimatesMeta: data?.response?.meta,
      estimatesLoading: isLoading,
      estimatesError: error,
      estimatesValidating: isValidating,
      estimatesEmpty: !isLoading && !isValidating && !data?.response?.data.length,
      estimatesMutate: APIMutate,
    }),
    [data?.response?.data, data?.response?.meta, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetEstimate(id: string) {
  const url = id ? ENDPOINT.details(id) : '';

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: APIMutate,
  } = useSWR<IApiGetOneResponse<EstimateDetails>>(url, fetcher, {
    revalidateOnMount: true,
    revalidateIfStale: true,
  });

  const memoizedValue = useMemo(
    () => ({
      estimate: data?.response,
      estimateLoading: isLoading,
      estimateEmpty: !isLoading && !isValidating && !data?.response?.id,
      estimateError: error,
      estimateValidating: isValidating,
      estimateMutate: APIMutate,
    }),
    [data?.response, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}
