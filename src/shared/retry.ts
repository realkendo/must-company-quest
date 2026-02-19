/**
 * retry.ts
 *
 * Generic retry wrapper for async operations.
 *
 * Features:
 * - Retries failed async functions
 * - Configurable retry count
 * - Configurable delay between attempts
 * - Logs each attempt and failure
 *
 * Used for:
 * - Network resilience
 * - Handling timeouts
 * - Handling 4xx / 5xx HTTP errors
 *
 * Improves crawler stability and fault tolerance.
 */

import logger from "./logger";

export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 2000
): Promise<T> {
  let attempt = 0;

  while (attempt < retries) {
    try {
      attempt++;
      logger.info(`Attempt ${attempt}...`);
      return await fn();
    } catch (error: any) {
      logger.warn(
        `Attempt ${attempt} failed: ${error.message}`
      );

      if (attempt >= retries) {
        logger.error("Max retry attempts reached.");
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Retry logic failure");
}
