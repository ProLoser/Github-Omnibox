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

export const DEFAULT_BASE = 'https://github.com';
const DEFAULT_GIST = 'https://gist.github.com';

/** @param {string} s */
function enc(s) { return encodeURIComponent(s); }

/**
 * Build a COMMANDS array whose URL functions use `base` as the GitHub host.
 * Pass a GitHub Enterprise Server base URL (e.g. "https://github.myco.com") to
 * generate GHE-specific links.
 *
 * @param {string} [base] - base URL, defaults to https://github.com
 * @returns {object[]}
 */
export function makeCommands(base = DEFAULT_BASE) {
  // GHE hosts gists at /gist instead of gist.github.com
  const gist = base === DEFAULT_BASE ? DEFAULT_GIST : `${base}/gist`;

  return [
    {
      name: 'repo',
      description: 'Manage repositories',
      subcommands: [
        { name: 'view',   description: 'View a repository',         argTypes: ['repo'],           url: ([r])    => `${base}/${r}` },
        { name: 'list',   description: 'List repositories',         argTypes: ['owner'],          url: ([o='']) => `${base}/${o}` },
        { name: 'create', description: 'Create a new repository',   argTypes: [],                 url: ()       => `${base}/new` },
        { name: 'fork',   description: 'Fork a repository',         argTypes: ['repo'],           url: ([r])    => `${base}/${r}/fork` },
        { name: 'rename', description: 'Rename a repository',       argTypes: ['repo'],           url: ([r])    => `${base}/${r}/settings` },
      ],
    },
    {
      name: 'issue',
      description: 'Manage issues',
      subcommands: [
        { name: 'list',   description: 'List issues',               argTypes: ['repo'],           url: ([r])    => `${base}/${r}/issues` },
        { name: 'view',   description: 'View an issue',             argTypes: ['repo', 'number'], url: ([r, n]) => `${base}/${r}/issues/${n}` },
        { name: 'create', description: 'Create an issue',           argTypes: ['repo'],           url: ([r])    => `${base}/${r}/issues/new` },
      ],
    },
    {
      name: 'pr',
      description: 'Manage pull requests',
      subcommands: [
        { name: 'list',   description: 'List pull requests',        argTypes: ['repo'],           url: ([r])    => `${base}/${r}/pulls` },
        { name: 'view',   description: 'View a pull request',       argTypes: ['repo', 'number'], url: ([r, n]) => `${base}/${r}/pull/${n}` },
        { name: 'create', description: 'Create a pull request',     argTypes: ['repo'],           url: ([r])    => `${base}/${r}/compare` },
      ],
    },
    {
      name: 'release',
      description: 'Manage releases',
      subcommands: [
        { name: 'list',   description: 'List releases',             argTypes: ['repo'],           url: ([r])    => `${base}/${r}/releases` },
        { name: 'view',   description: 'View a release',            argTypes: ['repo', 'tag'],    url: ([r, t]) => t ? `${base}/${r}/releases/tag/${t}` : `${base}/${r}/releases/latest` },
        { name: 'create', description: 'Create a release',          argTypes: ['repo'],           url: ([r])    => `${base}/${r}/releases/new` },
      ],
    },
    {
      name: 'gist',
      description: 'Manage gists',
      subcommands: [
        { name: 'list',   description: 'List gists',                argTypes: [],                 url: ()       => gist },
        { name: 'view',   description: 'View a gist',               argTypes: ['gist-id'],        url: ([id])   => `${gist}/${id}` },
        { name: 'create', description: 'Create a gist',             argTypes: [],                 url: ()       => gist },
      ],
    },
    {
      name: 'workflow',
      description: 'Manage GitHub Actions workflows',
      subcommands: [
        { name: 'list',   description: 'List workflows',            argTypes: ['repo'],           url: ([r])    => `${base}/${r}/actions` },
        { name: 'view',   description: 'View a workflow',           argTypes: ['repo'],           url: ([r])    => `${base}/${r}/actions` },
      ],
    },
    {
      name: 'run',
      description: 'Manage GitHub Actions runs',
      subcommands: [
        { name: 'list',   description: 'List workflow runs',        argTypes: ['repo'],           url: ([r])    => `${base}/${r}/actions` },
        { name: 'view',   description: 'View a workflow run',       argTypes: ['repo'],           url: ([r])    => `${base}/${r}/actions` },
      ],
    },
    {
      name: 'search',
      description: 'Search GitHub',
      subcommands: [
        { name: 'repos',  description: 'Search repositories',       argTypes: ['...query'],       url: (a) => `${base}/search?q=${enc(a.join(' '))}&type=repositories` },
        { name: 'issues', description: 'Search issues',             argTypes: ['...query'],       url: (a) => `${base}/search?q=${enc(a.join(' '))}&type=issues` },
        { name: 'prs',    description: 'Search pull requests',      argTypes: ['...query'],       url: (a) => `${base}/search?q=${enc(a.join(' '))}&type=pullrequests` },
        { name: 'code',   description: 'Search code',               argTypes: ['...query'],       url: (a) => `${base}/search?q=${enc(a.join(' '))}&type=code` },
      ],
    },
  ];
}

/** Default COMMANDS array using https://github.com as the base. */
export const COMMANDS = makeCommands();

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
