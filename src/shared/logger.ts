/**
 * logger.ts
 *
 * Centralized logging configuration for the crawler system.
 * 
 * Why this exists:
 * - Prevents console.log scattered everywhere
 * - Stores logs in files for debugging
 * - Provides structured logging (JSON format)
 * - Makes the system production-ready
 */

import winston from "winston";
import path from "path";

// Define the directory where log files will be stored
// __dirname points to the compiled file location in /dist
// We move up to reach the root logs folder
const logDir = path.join(__dirname, "../../logs");

/**
 * Create a Winston logger instance.
 * 
 * Configuration:
 * - level: Minimum log level to record
 * - format: Add timestamp + JSON structure
 * - transports: Where logs are sent (console + files)
 */
const logger = winston.createLogger({
  level: "info", // Logs 'info' and above (warn, error)
  format: winston.format.combine(
    winston.format.timestamp(), // Adds timestamp field
    winston.format.json()       // Outputs structured JSON logs
  ),
  transports: [
    // Console output (human-readable)
    new winston.transports.Console({ format: winston.format.simple() }),

    // Error logs stored separately
    new winston.transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),

    // All logs stored here
    new winston.transports.File({ filename: path.join(logDir, "combined.log") })
  ]
});

// Export logger so other modules can use it
export default logger;
