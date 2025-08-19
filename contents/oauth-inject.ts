import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://github.com/robots.txt*"],
  run_at: "document_start"
}

console.log("OAuth redirect script running");

// This script serves as an intermediary between the OAuth provider
// and the extension's internal OAuth handling page.

// Get all ? params from the current URL
const url = window.location.href;
let params = '?';
const index = url.indexOf('?');
if (index > -1) {
  params = url.substring(index);
}

// Also append the original URL to the params for context
params += '&from=' + encodeURIComponent(url);

// Redirect back to the extension itself so that we have privileged access again
const redirect = chrome.runtime.getURL('oauth2/oauth2.html');
window.location.href = redirect + params;
