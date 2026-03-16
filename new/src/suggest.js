/**
 * Suggestion engine — pure function, no Chrome/network side-effects.
 *
 * Combines three sources:
 *   1. Static command/subcommand tree (always available)
 *   2. Browser history repos    (provided by caller)
 *   3. GitHub online search repos (provided by caller)
 *
 * Returns an array of Chrome Omnibox suggestion objects:
 *   { content: string, description: string }
 */

import { parse } from './parser.js';

const MAX_REPO_SUGGESTIONS = 6;

/**
 * @param {object}   opts
 * @param {string}   opts.text          - current omnibox input
 * @param {object[]} opts.commands      - COMMANDS array from commands.js
 * @param {string[]} [opts.historyRepos] - "owner/repo" strings from history
 * @param {string[]} [opts.searchRepos]  - "owner/repo" strings from GitHub search
 * @returns {{ content: string, description: string }[]}
 */
export function getSuggestions({ text, commands, historyRepos = [], searchRepos = [] }) {
  const { tokens, partial } = parse(text);

  // ── Stage 0: completing the top-level command ───────────────────────────
  if (tokens.length === 0) {
    return commands
      .filter(c => c.name.startsWith(partial))
      .map(c => ({
        content: `${c.name} `,
        description: `<dim>${c.name}</dim> — ${c.description}`,
      }));
  }

  const command = commands.find(c => c.name === tokens[0]);
  if (!command) return [];

  // ── Stage 1: completing the subcommand ──────────────────────────────────
  if (tokens.length === 1) {
    return command.subcommands
      .filter(s => s.name.startsWith(partial))
      .map(s => ({
        content: `${command.name} ${s.name} `,
        description: `<dim>${command.name} ${s.name}</dim> — ${s.description}`,
      }));
  }

  const subcommand = command.subcommands.find(s => s.name === tokens[1]);
  if (!subcommand) return [];

  // ── Stage 2+: completing arguments ──────────────────────────────────────
  const completedArgs = tokens.slice(2);              // args already confirmed
  const argIndex      = completedArgs.length;          // index of arg being typed
  const argType       = subcommand.argTypes[argIndex]; // what this arg should be

  // No more args needed — offer a "navigate" hint
  if (!argType) {
    return [{
      content: tokens.join(' '),
      description: `Navigate → ${subcommand.url(completedArgs)}`,
    }];
  }

  // Variadic search query — just show a hint, user types freely
  if (argType === '...query') {
    const queryArgs = [...completedArgs, partial].filter(Boolean);
    const preview   = queryArgs.length ? subcommand.url(queryArgs) : '';
    return [{
      content: text.trimEnd(),
      description: preview
        ? `Navigate → ${preview}`
        : `<dim>${command.name} ${subcommand.name}</dim> — type your search query`,
    }];
  }

  // Repo / owner — suggest from history + online search
  if (argType === 'repo' || argType === 'owner') {
    const combined = dedup([...historyRepos, ...searchRepos]);
    const filtered = partial
      ? combined.filter(r => r.toLowerCase().includes(partial.toLowerCase()))
      : combined;
    const prefix   = [command.name, subcommand.name, ...completedArgs].join(' ');
    // Does this command expect more args after the repo?
    const hasMoreArgs = subcommand.argTypes.length > argIndex + 1;

    return filtered.slice(0, MAX_REPO_SUGGESTIONS).map(r => ({
      content: hasMoreArgs ? `${prefix} ${r} ` : `${prefix} ${r}`,
      description: `<dim>${command.name} ${subcommand.name}</dim> <match>${r}</match>`,
    }));
  }

  // Other arg types (number, tag, gist-id) — just show a type hint
  return [{
    content: text.trimEnd(),
    description: `<dim>${command.name} ${subcommand.name}</dim> — enter ${argType}`,
  }];
}

/** @param {string[]} arr */
function dedup(arr) {
  return [...new Set(arr)];
}
