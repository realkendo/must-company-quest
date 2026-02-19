/**
 * crawler.ts
 * 
 * Responsible for: 
 * -Fetching HTML from target url
 * -Extracting basic structured data 
 * -Returning parsed result
 * 
 */

import axios from "axios";
import * as cheerio from "cheerio";

export interface CrawlResult{
  title: string;
  links: string[];
  images: string[];
}

export async function crawl(url: string): Promise<CrawlResult> {
  // perform HTTP request with timeout + user-agent 
  const response = await axios.get(url, { timeout: 10000, headers: { "User-Agent" : "Mozilla/5.0(Linux Crawler Bot)" }});
  const html = response.data;

  // load html into cheerio
  const $ = cheerio.load(html);

  // extract structured data
  const title = $("title").text();
  const links = $("a").map((_, el) => $(el).attr("href")).get().filter(Boolean);
  const images = $("img").map((_, el) => $(el).attr("src")).get().filter(Boolean);

  return { title, links, images}
}