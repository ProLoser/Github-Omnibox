import { COMMANDS, findCommand, findSubcommand, buildUrl } from '../src/commands.js';

describe('COMMANDS', () => {
  test('exports a non-empty array', () => {
    expect(Array.isArray(COMMANDS)).toBe(true);
    expect(COMMANDS.length).toBeGreaterThan(0);
  });

  test('every command has a name, description, and subcommands array', () => {
    for (const cmd of COMMANDS) {
      expect(typeof cmd.name).toBe('string');
      expect(typeof cmd.description).toBe('string');
      expect(Array.isArray(cmd.subcommands)).toBe(true);
    }
  });

  test('every subcommand has a name, description, argTypes, and url function', () => {
    for (const cmd of COMMANDS) {
      for (const sub of cmd.subcommands) {
        expect(typeof sub.name).toBe('string');
        expect(typeof sub.description).toBe('string');
        expect(Array.isArray(sub.argTypes)).toBe(true);
        expect(typeof sub.url).toBe('function');
      }
    }
  });
});

describe('findCommand', () => {
  test('finds an existing command', () => {
    expect(findCommand('repo')).toBeDefined();
    expect(findCommand('issue')).toBeDefined();
    expect(findCommand('search')).toBeDefined();
  });

  test('returns null for unknown command', () => {
    expect(findCommand('unknown')).toBeNull();
    expect(findCommand('')).toBeNull();
  });
});

describe('findSubcommand', () => {
  test('finds an existing subcommand', () => {
    expect(findSubcommand('repo', 'view')).toBeDefined();
    expect(findSubcommand('issue', 'list')).toBeDefined();
    expect(findSubcommand('pr', 'create')).toBeDefined();
  });

  test('returns null for unknown subcommand', () => {
    expect(findSubcommand('repo', 'nonexistent')).toBeNull();
  });

  test('returns null for unknown command', () => {
    expect(findSubcommand('unknown', 'view')).toBeNull();
  });
});

describe('buildUrl', () => {
  test('repo view → github.com/owner/repo', () => {
    expect(buildUrl('repo', 'view', ['facebook/react'])).toBe('https://github.com/facebook/react');
  });

  test('repo create → github.com/new', () => {
    expect(buildUrl('repo', 'create', [])).toBe('https://github.com/new');
  });

  test('repo fork → fork URL', () => {
    expect(buildUrl('repo', 'fork', ['facebook/react'])).toBe('https://github.com/facebook/react/fork');
  });

  test('issue list → issues page', () => {
    expect(buildUrl('issue', 'list', ['facebook/react'])).toBe('https://github.com/facebook/react/issues');
  });

  test('issue view → specific issue', () => {
    expect(buildUrl('issue', 'view', ['facebook/react', '42'])).toBe('https://github.com/facebook/react/issues/42');
  });

  test('issue create → new issue form', () => {
    expect(buildUrl('issue', 'create', ['facebook/react'])).toBe('https://github.com/facebook/react/issues/new');
  });

  test('pr list → pulls page', () => {
    expect(buildUrl('pr', 'list', ['facebook/react'])).toBe('https://github.com/facebook/react/pulls');
  });

  test('pr view → specific PR', () => {
    expect(buildUrl('pr', 'view', ['facebook/react', '123'])).toBe('https://github.com/facebook/react/pull/123');
  });

  test('pr create → compare page', () => {
    expect(buildUrl('pr', 'create', ['facebook/react'])).toBe('https://github.com/facebook/react/compare');
  });

  test('release list → releases page', () => {
    expect(buildUrl('release', 'list', ['facebook/react'])).toBe('https://github.com/facebook/react/releases');
  });

  test('release view with tag → specific release tag', () => {
    expect(buildUrl('release', 'view', ['facebook/react', 'v18.0.0'])).toBe('https://github.com/facebook/react/releases/tag/v18.0.0');
  });

  test('release view without tag → latest release', () => {
    expect(buildUrl('release', 'view', ['facebook/react'])).toBe('https://github.com/facebook/react/releases/latest');
  });

  test('gist list → gist.github.com', () => {
    expect(buildUrl('gist', 'list', [])).toBe('https://gist.github.com');
  });

  test('gist view → specific gist', () => {
    expect(buildUrl('gist', 'view', ['abc123'])).toBe('https://gist.github.com/abc123');
  });

  test('workflow list → actions page', () => {
    expect(buildUrl('workflow', 'list', ['facebook/react'])).toBe('https://github.com/facebook/react/actions');
  });

  test('search repos → GitHub search with type=repositories', () => {
    const url = buildUrl('search', 'repos', ['react', 'hooks']);
    expect(url).toBe('https://github.com/search?q=react%20hooks&type=repositories');
  });

  test('search issues → GitHub search with type=issues', () => {
    const url = buildUrl('search', 'issues', ['bug', 'fix']);
    expect(url).toBe('https://github.com/search?q=bug%20fix&type=issues');
  });

  test('search code → GitHub search with type=code', () => {
    const url = buildUrl('search', 'code', ['useState', 'hook']);
    expect(url).toBe('https://github.com/search?q=useState%20hook&type=code');
  });

  test('returns null for unknown command/subcommand', () => {
    expect(buildUrl('nope', 'view', [])).toBeNull();
    expect(buildUrl('repo', 'nope', [])).toBeNull();
  });
});
