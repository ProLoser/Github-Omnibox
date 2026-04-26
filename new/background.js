/**
 * GitHub Omnibox — service worker (Manifest V3)
 *
 * Handles Chrome Omnibox events for the "gh" keyword.
 * Suggestions are powered by:
 *   1. Static gh-CLI–compatible command tree
 *   2. Browser history (no API key required)
 *   3. GitHub public Search API (no auth required)
 *
 * GitHub Enterprise support:
 *   Right-click the extension icon and choose "Set as GitHub Enterprise domain"
 *   while on your GHE instance. The setting is stored in chrome.storage.sync
 *   and applied to all URL generation and history searches automatically.
 *   Choose "Reset to github.com" to revert to the public host.
 */

import { DEFAULT_BASE, makeCommands } from './src/commands.js';
import { getSuggestions } from './src/suggest.js';
import { searchHistory } from './src/history.js';
import { searchGitHub } from './src/search.js';
import { resolve } from './src/navigate.js';

// ── GHE settings helpers ────────────────────────────────────────────────────

/** @returns {Promise<string>} stored GHE base URL or the default github.com base */
function getBase() {
  return new Promise(res => {
    chrome.storage.sync.get('gheBase', ({ gheBase }) => res(gheBase || DEFAULT_BASE));
  });
}

// ── Extension lifecycle ─────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(() => {
  // Right-click the extension icon → context menu items for GHE configuration
  chrome.contextMenus.create({
    id: 'set-ghe-domain',
    title: 'Set as GitHub Enterprise domain',
    contexts: ['action'],
  });
  chrome.contextMenus.create({
    id: 'reset-to-github',
    title: 'Reset to github.com',
    contexts: ['action'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'set-ghe-domain' && tab?.url) {
    try {
      const { protocol, hostname } = new URL(tab.url);
      const base = `${protocol}//${hostname}`;
      chrome.storage.sync.set({ gheBase: base });
    } catch { /* ignore unparseable URLs */ }
  } else if (info.menuItemId === 'reset-to-github') {
    chrome.storage.sync.remove('gheBase');
  }
});

// ── Omnibox ─────────────────────────────────────────────────────────────────

chrome.omnibox.setDefaultSuggestion({
  description: 'GitHub: type <match>owner/repo</match> to open a repo, or a command — <dim>repo view</dim>, <dim>issue list</dim>, <dim>pr create</dim>',
});

chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  const base     = await getBase();
  const commands = makeCommands(base);

  // Derive the current partial token for online/history search
  const lastToken = text.trim().split(/\s+/).pop() ?? '';

  const [historyRepos, searchRepos] = await Promise.all([
    searchHistory(lastToken, chrome.history.search.bind(chrome.history), base),
    searchGitHub(lastToken),
  ]);

  const suggestions = getSuggestions({ text, commands, historyRepos, searchRepos });
  if (suggestions.length > 0) suggest(suggestions);
});

chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
  const base     = await getBase();
  const commands = makeCommands(base);
  const url      = resolve(text, commands, base);

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
