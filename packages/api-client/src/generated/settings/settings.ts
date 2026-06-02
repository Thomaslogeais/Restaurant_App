// ⚠️  AUTO-GENERATED — DO NOT EDIT MANUALLY
// Re-generate with: pnpm gen:contract (from repo root)
// Source: services/backend /openapi.json → Orval
// @see packages/api-client/orval.config.ts
import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  GetSettings200,
  GetSettings404,
  UpdateSettings200,
  UpdateSettings404,
  UpdateSettingsBody
} from '../restaurantAPI.schemas';

import { customInstance } from '../../lib/custom-instance';
import type { ErrorType } from '../../lib/custom-instance';




/**
 * @summary Get ordering settings for a restaurant
 */
export const getSettings = (
    
 signal?: AbortSignal
) => {
      
      
      return customInstance<GetSettings200>(
      {url: `/api/settings/:restaurantId`, method: 'GET', signal
    },
      );
    }
  



export const getGetSettingsQueryKey = () => {
    return [
    `/api/settings/:restaurantId`
    ] as const;
    }

    
export const getGetSettingsQueryOptions = <TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<GetSettings404>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetSettingsQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getSettings>>> = ({ signal }) => getSettings(signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData> & { queryKey: DataTag<QueryKey, TData> }
}

export type GetSettingsQueryResult = NonNullable<Awaited<ReturnType<typeof getSettings>>>
export type GetSettingsQueryError = ErrorType<GetSettings404>


export function useGetSettings<TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<GetSettings404>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getSettings>>,
          TError,
          Awaited<ReturnType<typeof getSettings>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
export function useGetSettings<TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<GetSettings404>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getSettings>>,
          TError,
          Awaited<ReturnType<typeof getSettings>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
export function useGetSettings<TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<GetSettings404>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
/**
 * @summary Get ordering settings for a restaurant
 */

export function useGetSettings<TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<GetSettings404>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {

  const queryOptions = getGetSettingsQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Update ordering settings
 */
export const updateSettings = (
    updateSettingsBody: UpdateSettingsBody,
 ) => {
      
      
      return customInstance<UpdateSettings200>(
      {url: `/api/settings/:restaurantId`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: updateSettingsBody
    },
      );
    }
  


export const getUpdateSettingsMutationOptions = <TError = ErrorType<UpdateSettings404>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError,{data: UpdateSettingsBody}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError,{data: UpdateSettingsBody}, TContext> => {

const mutationKey = ['updateSettings'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateSettings>>, {data: UpdateSettingsBody}> = (props) => {
          const {data} = props ?? {};

          return  updateSettings(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type UpdateSettingsMutationResult = NonNullable<Awaited<ReturnType<typeof updateSettings>>>
    export type UpdateSettingsMutationBody = UpdateSettingsBody
    export type UpdateSettingsMutationError = ErrorType<UpdateSettings404>

    /**
 * @summary Update ordering settings
 */
export const useUpdateSettings = <TError = ErrorType<UpdateSettings404>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError,{data: UpdateSettingsBody}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateSettings>>,
        TError,
        {data: UpdateSettingsBody},
        TContext
      > => {

      const mutationOptions = getUpdateSettingsMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    