/**
 * Command definitions matching the GitHub CLI (gh) API.
 *
 * Each leaf (subcommand) defines:
 *   name        - subcommand token (e.g. "view")
 *   description - human-readable label for the suggestion row
 *   argTypes    - ordered list of expected argument types:
 *                   'repo'     owner/name pair   (e.g. "facebook/react")
 *                   'owner'    user or org        (e.g. "facebook")
 *                   'number'   issue/PR number    (e.g. "42")
 *                   'tag'      release tag        (e.g. "v1.0.0")
 *                   'gist-id'  gist identifier
 *                   '...query' variadic rest args joined as a search query
 *   url         - function(args: string[]) => string URL
 */

const BASE = 'https://github.com';
const GIST = 'https://gist.github.com';

/** @param {string} s */
function enc(s) { return encodeURIComponent(s); }

export const COMMANDS = [
  {
    name: 'repo',
    description: 'Manage repositories',
    subcommands: [
      { name: 'view',   description: 'View a repository',         argTypes: ['repo'],           url: ([r])    => `${BASE}/${r}` },
      { name: 'list',   description: 'List repositories',         argTypes: ['owner'],          url: ([o='']) => `${BASE}/${o}` },
      { name: 'create', description: 'Create a new repository',   argTypes: [],                 url: ()       => `${BASE}/new` },
      { name: 'fork',   description: 'Fork a repository',         argTypes: ['repo'],           url: ([r])    => `${BASE}/${r}/fork` },
      { name: 'rename', description: 'Rename a repository',       argTypes: ['repo'],           url: ([r])    => `${BASE}/${r}/settings` },
    ],
  },
  {
    name: 'issue',
    description: 'Manage issues',
    subcommands: [
      { name: 'list',   description: 'List issues',               argTypes: ['repo'],           url: ([r])    => `${BASE}/${r}/issues` },
      { name: 'view',   description: 'View an issue',             argTypes: ['repo', 'number'], url: ([r, n]) => `${BASE}/${r}/issues/${n}` },
      { name: 'create', description: 'Create an issue',           argTypes: ['repo'],           url: ([r])    => `${BASE}/${r}/issues/new` },
    ],
  },
  {
    name: 'pr',
    description: 'Manage pull requests',
    subcommands: [
      { name: 'list',   description: 'List pull requests',        argTypes: ['repo'],           url: ([r])    => `${BASE}/${r}/pulls` },
      { name: 'view',   description: 'View a pull request',       argTypes: ['repo', 'number'], url: ([r, n]) => `${BASE}/${r}/pull/${n}` },
      { name: 'create', description: 'Create a pull request',     argTypes: ['repo'],           url: ([r])    => `${BASE}/${r}/compare` },
    ],
  },
  {
    name: 'release',
    description: 'Manage releases',
    subcommands: [
      { name: 'list',   description: 'List releases',             argTypes: ['repo'],           url: ([r])    => `${BASE}/${r}/releases` },
      { name: 'view',   description: 'View a release',            argTypes: ['repo', 'tag'],    url: ([r, t]) => t ? `${BASE}/${r}/releases/tag/${t}` : `${BASE}/${r}/releases/latest` },
      { name: 'create', description: 'Create a release',          argTypes: ['repo'],           url: ([r])    => `${BASE}/${r}/releases/new` },
    ],
  },
  {
    name: 'gist',
    description: 'Manage gists',
    subcommands: [
      { name: 'list',   description: 'List gists',                argTypes: [],                 url: ()       => GIST },
      { name: 'view',   description: 'View a gist',               argTypes: ['gist-id'],        url: ([id])   => `${GIST}/${id}` },
      { name: 'create', description: 'Create a gist',             argTypes: [],                 url: ()       => GIST },
    ],
  },
  {
    name: 'workflow',
    description: 'Manage GitHub Actions workflows',
    subcommands: [
      { name: 'list',   description: 'List workflows',            argTypes: ['repo'],           url: ([r])    => `${BASE}/${r}/actions` },
      { name: 'view',   description: 'View a workflow',           argTypes: ['repo'],           url: ([r])    => `${BASE}/${r}/actions` },
    ],
  },
  {
    name: 'run',
    description: 'Manage GitHub Actions runs',
    subcommands: [
      { name: 'list',   description: 'List workflow runs',        argTypes: ['repo'],           url: ([r])    => `${BASE}/${r}/actions` },
      { name: 'view',   description: 'View a workflow run',       argTypes: ['repo'],           url: ([r])    => `${BASE}/${r}/actions` },
    ],
  },
  {
    name: 'search',
    description: 'Search GitHub',
    subcommands: [
      { name: 'repos',  description: 'Search repositories',       argTypes: ['...query'],       url: (a) => `${BASE}/search?q=${enc(a.join(' '))}&type=repositories` },
      { name: 'issues', description: 'Search issues',             argTypes: ['...query'],       url: (a) => `${BASE}/search?q=${enc(a.join(' '))}&type=issues` },
      { name: 'prs',    description: 'Search pull requests',      argTypes: ['...query'],       url: (a) => `${BASE}/search?q=${enc(a.join(' '))}&type=pullrequests` },
      { name: 'code',   description: 'Search code',               argTypes: ['...query'],       url: (a) => `${BASE}/search?q=${enc(a.join(' '))}&type=code` },
    ],
  },
];

/**
 * Find a top-level command by exact name.
 * @param {string} name
 * @returns {object|null}
 */
export function findCommand(name) {
  return COMMANDS.find(c => c.name === name) ?? null;
}

/**
 * Find a subcommand by exact command and subcommand names.
 * @param {string} cmdName
 * @param {string} subcmdName
 * @returns {object|null}
 */
export function findSubcommand(cmdName, subcmdName) {
  const cmd = findCommand(cmdName);
  return cmd ? (cmd.subcommands.find(s => s.name === subcmdName) ?? null) : null;
}

/**
 * Build the destination URL for a fully-specified command.
 * Returns null when the command/subcommand is not found.
 * @param {string} cmdName
 * @param {string} subcmdName
 * @param {string[]} args
 * @returns {string|null}
 */
export function buildUrl(cmdName, subcmdName, args = []) {
  const sub = findSubcommand(cmdName, subcmdName);
  return sub ? sub.url(args) : null;
}
