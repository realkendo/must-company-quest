/**
 * index.ts (Quest 4 Entry Point)
 *
 * This file is the starting point of the Linux crawler system.
 * 
 * For now, we are only testing the logger.
 * Later, this will:
 * - Trigger crawling
 * - Handle scheduling
 * - Measure performance
 */

import logger from "../shared/logger";

// Log an informational message
logger.info("Crawler started");

// Log a warning message
logger.warn("This is a warning");

// Log an error message
logger.error("This is an error example");
