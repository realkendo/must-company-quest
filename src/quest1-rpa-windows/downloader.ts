/**
 * Quest 1 - PDF Downloader Module
 * 
 * Responsilities:
 * - Download PDF via direct HTTP request (not browser download)
 * - Save files to local filesystem 
 * - Execute downloads in parallel for performance
 * - Log download status
 * 
 * Note: This module is designed to be imported and used by the main RPA workflow in 'rpa.ts'. It focuses solely on the downloading aspect, allowing for separation of concerns and easier maintenance.
 */

import axios from "axios";
import fs from "fs";
import path from "path";
import logger from "../shared/logger";

export async function downloadPDFs(urls: string[]): Promise<void>{
  // define output directory for PDF downloads
  const downloadDir = path.join(process.cwd(), "data", "quest1-pdfs"); 

  // ensuring directory exists before processing downloads
  if (!fs.existsSync(downloadDir)){
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  /**
   * use promise.all for parallel downloads
   * this significantly reduces total execution time
   * compared to sequential downloads
   */

  await Promise.all(
    urls.map( async (url, index) => {
      try{
        logger.info(`Downloading PDF ${index +1}...`);

        const response = await axios.get(url, { 
          responseType: "arraybuffer", timeout: 15000
        });

        const filePath = path.join(downloadDir, `file-${index + 1}.pdf`);

        fs.writeFileSync(filePath, response.data);
        logger.info(`Successfully downloaded PDF: ${filePath} `);

      }catch(error){
        logger.info(`Failed to download PDF from ${url}. Error: ${error}`)
      }
    })
  );

  logger.info("All download tasks completed."); 
}