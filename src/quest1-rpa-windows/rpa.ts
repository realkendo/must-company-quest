/**
 * Quest 1: RPA Core Logic
 * 
 * Responsibilities:
 * - Launch Chromium in headless mode
 * - Optimize resource laoding for performance
 * - Navigate to target site
 * - Perform search interaction  
 * - Extract PDF URLs from search results
 * - Delegate downlaod to downloader module
 * - Ensure proper cleanup of browser resources
 * 
 * Note: This module focuses on the core RPA workflow. It is designed to be imported and executed by the main entry point (index.ts), which handles orchestration and performance measurement. The actual PDF downloading logic is delegated to a separate module (pdfDownloader.ts) to maintain separation of concerns and modularity.
 */


import { chromium } from "playwright";
import { downloadPDFs } from "./downloader";
import logger from "../shared/logger";
import { BASE_URL_Q1 } from "../config";

export async function runRPA(): Promise<void>{
  // launch chromium browser in headless mode for automation
  const browser = await chromium.launch({ headless: true});

  // create isolated browser context to avoid shared state and ensure clean environment
  const context = await browser.newContext({ javaScriptEnabled: true});

  /**
   * Performance Optimization:
   * Blocking unnecessary resources like images, fonts and stylesheets to reduce load time.
   */
  await context.route("**/*", (route) => {
    const resourceType = route.request().resourceType();

    if (["image", "font", "stylesheet"].includes(resourceType)){
      route.abort(); //block resource to optimize performance
    }else{
      route.continue(); //allow essential resources to load 
    }
  });

  const page = await context.newPage();

  try{
    logger.info("Navigating to target website...");

    // navigate to the target website
    await page.goto(BASE_URL_Q1, { timeout: 15000, waitUntil: "domcontentloaded"});

    logger.info("Page loaded successfully. Performing search interaction...");
    logger.info("Extracting PDF links...");

    // extract PDF URLs from search results
    const pdfLinks: string[] = await page.$$eval("a[href$='.pdf']", (anchors) => 
      anchors.map((a) => (a as HTMLAnchorElement).href)
    );

    logger.info(`Found ${pdfLinks.length} PDF file(s).`)

    // downloading PDFs using the downloader module
    if(pdfLinks.length > 0){
      logger.warn("No PDF links found on the page.");
    }else{
      // download PDFs in parallel
      await downloadPDFs(pdfLinks);
    }
  }catch(error){
    logger.error(`RPA process encountered an error. ${error}`);
    throw error;
  }finally{
    /**
     * Always close browser to release system resources
     * Prevents memory leaks and zomnie processes that can degrade performcance
     */
    await browser.close();
    logger.info("Browser closed, resources cleaned up.");
  }
}