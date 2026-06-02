/**
 * Orval mutator — thin axios wrapper used by every generated hook.
 *
 * Reads the API base URL from the Expo public env var so both development
 * (localhost) and production deployments work without code changes.
 */
import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';

// EXPO_PUBLIC_* vars are replaced by Metro/Webpack at bundle time.
// We access them via globalThis so this file stays compatible with
// DOM+ESNext tsconfig (no @types/node needed).
const BASE_URL: string = (() => {
  const g = globalThis as { process?: { env?: { EXPO_PUBLIC_API_URL?: string } } };
  return g.process?.env?.EXPO_PUBLIC_API_URL ?? 'http://localhost:8787';
})();

const instance = axios.create({ baseURL: BASE_URL });

/**
 * Generic request function — called by every Orval-generated hook.
 * Returns `response.data` directly so hooks receive the typed payload.
 */
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> =>
  instance(config).then((res) => res.data as T);

/** Re-export the error type so hooks can type-narrow errors easily. */
export type ErrorType<E = unknown> = AxiosError<E>;
