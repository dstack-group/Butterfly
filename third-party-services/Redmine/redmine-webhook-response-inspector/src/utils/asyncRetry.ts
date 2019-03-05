import pRetry from 'p-retry';

export interface AsyncRetry<T> {
  input: (attempts: number) => Promise<T>;
  retries: number;
  maxTimeout: number;
}

export const asyncRetry = async <T> (params: AsyncRetry<T>) => {
  const { input, retries, maxTimeout } = params;
  return await pRetry(input, {
    maxTimeout,
    retries,
  });
};
