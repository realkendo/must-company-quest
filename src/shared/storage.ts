/**
 * storage.ts
 * 
 * Handles saving crawler results into structured JSON files
 */

import fs from "fs/promises"
import path from"path"

const dataDir = path.join(__dirname, "../../data");

export async function saveJSON( data: unknown): Promise<string> { 
  const filename = `crawl-${Date.now()}.json`;
  const filepath = path.join(dataDir, filename);

  await fs.writeFile(filepath, JSON.stringify(data, null, 2));

  return filepath
} 