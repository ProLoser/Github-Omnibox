/**
 * GitHub Omnibox — service worker (Manifest V3)
 *
 * Handles Chrome Omnibox events for the "gh" keyword.
 * Suggestions are powered by:
 *   1. Static gh-CLI–compatible command tree
 *   2. Browser history (no API key required)
 *   3. GitHub public Search API (no auth required)
 */

import { COMMANDS } from './src/commands.js';
import { getSuggestions } from './src/suggest.js';
import { searchHistory } from './src/history.js';
import { searchGitHub } from './src/search.js';
import { resolve } from './src/navigate.js';

chrome.omnibox.setDefaultSuggestion({
  description: 'GitHub: type a <match>gh</match> command — e.g. <dim>repo view</dim>, <dim>issue list</dim>, <dim>search repos</dim>',
});

chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  // Derive the current partial token for online/history search
  const lastToken = text.trim().split(/\s+/).pop() ?? '';

  const [historyRepos, searchRepos] = await Promise.all([
    searchHistory(lastToken, chrome.history.search.bind(chrome.history)),
    searchGitHub(lastToken),
  ]);

  const suggestions = getSuggestions({ text, commands: COMMANDS, historyRepos, searchRepos });
  if (suggestions.length > 0) suggest(suggestions);
});

chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  const url = resolve(text, COMMANDS);
  switch (disposition) {
    case 'currentTab':
      chrome.tabs.update({ url });
      break;
    case 'newForegroundTab':
      chrome.tabs.create({ url });
      break;
    case 'newBackgroundTab':
      chrome.tabs.create({ url, active: false });
      break;
    default:
      chrome.tabs.update({ url });
  }
});
