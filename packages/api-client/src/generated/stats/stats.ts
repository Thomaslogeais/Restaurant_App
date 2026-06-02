// ⚠️  AUTO-GENERATED — DO NOT EDIT MANUALLY
// Re-generate with: pnpm gen:contract (from repo root)
// Source: services/backend /openapi.json → Orval
// @see packages/api-client/orval.config.ts
import {
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  GetStats200
} from '../restaurantAPI.schemas';

import { customInstance } from '../../lib/custom-instance';
import type { ErrorType } from '../../lib/custom-instance';




/**
 * Returns total order count, pending orders, total revenue from completed orders, and the top 5 menu items by quantity ordered. Always returns 200 with zero values if no data exists yet.
 * @summary Home screen KPIs for a restaurant
 */
export const getStats = (
    
 signal?: AbortSignal
) => {
      
      
      return customInstance<GetStats200>(
      {url: `/api/stats/:restaurantId`, method: 'GET', signal
    },
      );
    }
  



export const getGetStatsQueryKey = () => {
    return [
    `/api/stats/:restaurantId`
    ] as const;
    }

    
export const getGetStatsQueryOptions = <TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetStatsQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getStats>>> = ({ signal }) => getStats(signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData> & { queryKey: DataTag<QueryKey, TData> }
}

export type GetStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getStats>>>
export type GetStatsQueryError = ErrorType<unknown>


export function useGetStats<TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getStats>>,
          TError,
          Awaited<ReturnType<typeof getStats>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
export function useGetStats<TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getStats>>,
          TError,
          Awaited<ReturnType<typeof getStats>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
export function useGetStats<TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
/**
 * @summary Home screen KPIs for a restaurant
 */

export function useGetStats<TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {

  const queryOptions = getGetStatsQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




