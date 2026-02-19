/** 
* timer.ts
*
*utility to measure execution time of async operations.
*used to benchmark crawling performance

**/

export async function measureExecutionTime<T> ( label: string, fn: ()=> Promise<T> ): Promise<{ result: T; durationMs: number }> {
  const start = Date.now();
  const result = await fn();
  const end = Date.now();
  const durationMs = end - start;

  return { result, durationMs }
}