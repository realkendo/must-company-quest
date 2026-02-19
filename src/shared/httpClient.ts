/**
 * httpClient.ts
 *
 * Creates an axios instance that supports
 * automatic cookie handling using a CookieJar.
 * This allows session persistence after login.
 */

import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

// Create cookie jar to store session cookies
const jar = new CookieJar();

// Wrap axios with cookie support
const client = wrapper(
  axios.create({
    jar,
    withCredentials: true,
    timeout: 10000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux Crawler Bot)"
    }
  })
);

export default client;
