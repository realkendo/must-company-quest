/**
 * index.ts (Quest 4 Entry Point)
 *
 * This file is the entry point of the Linux crawler system.
 * 
 * It orchestrates
 * - Timing 
 * - Crawling
 * - Logging
 * - Saving results
 */

import logger from "../shared/logger";
import { measureExecutionTime } from "../shared/timer";
import { crawl } from "../shared/crawler";
import "dotenv/config"
import { saveJSON } from "../shared/storage";



async function runCrawler(){
  try{
    logger.info("Starting crawl process... ");

  // setting that target url with the exclamation at the end to quiet the undefined warning
  // however, it won't prevent an undefined for the variable at runtime if environment variable is missing
  const targetURL : string = process.env.TARGET_URL!;


  if(!targetURL){
    throw new Error(" TARGET_URL environment variable is missing")
  }

    const { result, durationMs } = await measureExecutionTime( "crawl", ()=> crawl(targetURL));

    logger.info(`Crawl competed in ${durationMs} ms`);
    const filepath = await saveJSON({
      metadata: {
        url: targetURL,
        crawlTimeMs: durationMs,
        timestamp: new Date().toISOString()
      },
      data: result
    });

    logger.info(`Data saved to: ${filepath}`);
  }
  // catching error if try block fails
  catch(error){
    logger.error("Crawl failed", error);
  }
}

runCrawler();
