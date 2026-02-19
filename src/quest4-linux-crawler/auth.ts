/**
 * auth.ts
 *
 * Handles login to quotes.toscrape.com
 */

import client from "../shared/httpClient";
import * as cheerio from "cheerio";
import logger from "../shared/logger";
import { retry } from "../shared/retry";
import { BASE_URL } from "../config";

export async function login(): Promise<void> {
  try {
    logger.info("Fetching login page...");

    // Step 1: Get login page to extract CSRF token
    const loginPage = await retry(()=> client.get(`${BASE_URL}/login`));

    const $ = cheerio.load(loginPage.data);
    const csrfToken = $("input[name='csrf_token']").val();

    if (!csrfToken) {
      throw new Error("CSRF token not found");
    }

    logger.info("CSRF token extracted");

    // Step 2: Post login credentials
    await retry( ()=> client.post(
      `${BASE_URL}/login`,
      new URLSearchParams({
        username: "admin",
        password: "admin",
        csrf_token: csrfToken.toString()
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    ));

    logger.info("Login successful");
  } catch (error: any) {
    logger.error(`Login failed: ${error.message}`);
    throw error;
  }
}
