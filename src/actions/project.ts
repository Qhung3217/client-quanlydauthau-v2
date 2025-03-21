'use client';

import type { SWRConfiguration } from 'swr';
import type { IReqSearchParams } from 'src/types/request';
import type { IApiListResponse, IApiGetOneResponse } from 'src/types/response';
import type { Project, ProjectStatus, ProjectDetails } from 'src/types/project';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------
const ENDPOINT = endpoints.project;

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateOnMount: true,
};

// ----------------------------------------------------------------------
export type IProjectsRes = IApiListResponse<Project[]>;

export function useGetProjects(
  params?: IReqSearchParams & {
    statuses?: ProjectStatus;
    isMyProjects?: boolean;
    isNotFetch?: boolean;
  }
) {
  const isNotFetch = params?.isNotFetch;

  const url = isNotFetch ? null : [ENDPOINT.list, { params }];

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: APIMutate,
  } = useSWR<IProjectsRes>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      projects: data?.response?.data || [],
      projectsMeta: data?.response?.meta,
      projectsLoading: isLoading,
      projectsError: error,
      projectsValidating: isValidating,
      projectsEmpty: !isLoading && !isValidating && !data?.response?.data.length,
      projectsMutate: APIMutate,
    }),
    [data?.response?.data, data?.response?.meta, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProject(id: string) {
  const url = id ? ENDPOINT.details(id) : '';

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: APIMutate,
  } = useSWR<IApiGetOneResponse<ProjectDetails>>(url, fetcher, {
    revalidateOnMount: true,
    revalidateIfStale: true,
  });

  const memoizedValue = useMemo(
    () => ({
      project: data?.response,
      projectLoading: isLoading,
      projectEmpty: !isLoading && !isValidating && !data?.response?.id,
      projectError: error,
      projectValidating: isValidating,
      projectMutate: APIMutate,
    }),
    [data?.response, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}
