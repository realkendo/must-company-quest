/**
 * index.ts
 *
 * Main entry point for Quest 4 Linux crawler.
 */

import { login } from "./auth";
import client from "../shared/httpClient";
import * as cheerio from "cheerio";
import logger from "../shared/logger";
import fs from "fs/promises";
import path from "path";
import { retry } from "../shared/retry";
import { BASE_URL } from "../config";

async function runCrawler() {
  try {
    logger.info("Starting crawl process...");

    await login();

    // Now we are authenticated
    const response = await retry(()=> client.get(BASE_URL));

    const $ = cheerio.load(response.data);

    const quotes = $(".quote")
      .map((_, el) => ({
        text: $(el).find(".text").text(),
        author: $(el).find(".author").text()
      }))
      .get();

    const output = {
      url: "http://quotes.toscrape.com",
      quotes,
      timestamp: new Date().toISOString()
    };

    const filePath = path.join(
      __dirname,
      "../../data",
      `crawl-${Date.now()}.json`
    );

    await fs.writeFile(filePath, JSON.stringify(output, null, 2));

    logger.info(`Data saved to: ${filePath}`);
  } catch (error: any) {
    logger.error(`Crawl failed: ${error.message}`);
  }
}

runCrawler();
