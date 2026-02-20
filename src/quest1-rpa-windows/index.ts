/**
 * QUEST 1: Windows RPA entry point
 * 
 * Responsibilities:
 * - Measure total execution time
 * - Trigger RPA process
 * - Handle top-level errors 
 * - Logging execution results 
 * 
 * Note: The actual RPA logic is implemented in the 'rpa.ts' module, which is imported and executed here. This file focuses on orchestration and performance measurement.
 */

import { performance } from "perf_hooks";
import { runRPA } from "./rpa";
import logger from "../shared/logger";

(async ()=> {
  // start high-precision performance timer
  const start = performance.now();

  try{
    logger.info("Starting RPA process for windows...");
    
    // execute main RPA workflow
    await runRPA();

    // end performance timer and calculate duration
    const end = performance.now();
    const duration = ((end - start) / 1000).toFixed(2);
    logger.info("RPA process completed successfully.");
    logger.info(`Execution time: ${duration}s`);
  }catch(error){
    // handling any unexpected errors that occur during the RPA process
    logger.error(`Quest 1 RPA process failed: ${error} `);
  }
})();