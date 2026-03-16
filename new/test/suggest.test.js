import { getSuggestions } from '../src/suggest.js';
import { COMMANDS } from '../src/commands.js';

// ── helpers ──────────────────────────────────────────────────────────────────

function suggest(text, { historyRepos = [], searchRepos = [] } = {}) {
  return getSuggestions({ text, commands: COMMANDS, historyRepos, searchRepos });
}

function contents(suggestions) {
  return suggestions.map(s => s.content);
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe('Stage 0 – command completion', () => {
  test('empty input lists all commands', () => {
    const result = suggest('');
    expect(result.length).toBe(COMMANDS.length);
    for (const cmd of COMMANDS) {
      expect(contents(result)).toContain(`${cmd.name} `);
    }
  });

  test('partial prefix filters commands', () => {
    const result = suggest('r');
    expect(contents(result)).toContain('repo ');
    expect(contents(result)).toContain('run ');
    expect(contents(result)).not.toContain('issue ');
  });

  test('exact command prefix', () => {
    const result = suggest('repo');
    expect(contents(result)).toContain('repo ');
  });

  test('no match returns empty', () => {
    expect(suggest('zzz')).toEqual([]);
  });
});

describe('Stage 1 – subcommand completion', () => {
  test('"repo " lists all repo subcommands', () => {
    const result = suggest('repo ');
    const repoSubs = COMMANDS.find(c => c.name === 'repo').subcommands;
    expect(result.length).toBe(repoSubs.length);
    expect(contents(result)).toContain('repo view ');
    expect(contents(result)).toContain('repo create ');
  });

  test('"repo v" filters to "view"', () => {
    const result = suggest('repo v');
    expect(contents(result)).toContain('repo view ');
    expect(contents(result)).not.toContain('repo create ');
  });

  test('"issue " lists all issue subcommands', () => {
    const result = suggest('issue ');
    expect(contents(result)).toContain('issue list ');
    expect(contents(result)).toContain('issue view ');
    expect(contents(result)).toContain('issue create ');
  });

  test('unknown command → empty', () => {
    expect(suggest('nope ')).toEqual([]);
  });
});

describe('Stage 2 – repo arg completion', () => {
  const repos = ['facebook/react', 'facebook/flux', 'microsoft/vscode'];

  test('"repo view " suggests repos from history and search', () => {
    const result = suggest('repo view ', { historyRepos: repos });
    expect(result.length).toBeGreaterThan(0);
    const c = contents(result);
    expect(c).toContain('repo view facebook/react');
    expect(c).toContain('repo view microsoft/vscode');
  });

  test('partial filter limits suggestions', () => {
    const result = suggest('repo view face', { historyRepos: repos });
    const c = contents(result);
    expect(c).toContain('repo view facebook/react');
    expect(c).toContain('repo view facebook/flux');
    expect(c).not.toContain('repo view microsoft/vscode');
  });

  test('history repos are deduped with search repos', () => {
    const result = suggest('repo view ', {
      historyRepos: ['facebook/react'],
      searchRepos: ['facebook/react', 'microsoft/vscode'],
    });
    const c = contents(result);
    // facebook/react should appear only once
    expect(c.filter(x => x === 'repo view facebook/react').length).toBe(1);
  });

  test('commands with multiple args add trailing space for continuation', () => {
    // issue view has argTypes: ['repo','number'] → repo arg should have trailing space
    const result = suggest('issue view ', { historyRepos: ['facebook/react'] });
    expect(contents(result)).toContain('issue view facebook/react ');
  });

  test('commands with single repo arg do not add trailing space', () => {
    // repo view has argTypes: ['repo'] → final arg, no trailing space
    const result = suggest('repo view ', { historyRepos: ['facebook/react'] });
    expect(contents(result)).toContain('repo view facebook/react');
    expect(contents(result)).not.toContain('repo view facebook/react ');
  });
});

describe('Stage 2 – search (variadic query)', () => {
  test('"search repos " shows a hint suggestion', () => {
    const result = suggest('search repos ');
    expect(result.length).toBe(1);
    expect(result[0].content).toContain('search repos');
  });

  test('"search repos react" builds a preview URL', () => {
    const result = suggest('search repos react');
    expect(result[0].description).toContain('github.com/search');
    expect(result[0].description).toContain('react');
  });
});

describe('Stage 2 – no args commands', () => {
  test('"repo create " suggests navigation hint', () => {
    const result = suggest('repo create ');
    expect(result.length).toBe(1);
    expect(result[0].description).toContain('github.com/new');
  });
});

describe('Stage 2 – non-repo arg types', () => {
  test('number arg shows type hint', () => {
    const result = suggest('issue view facebook/react ');
    expect(result.length).toBe(1);
    expect(result[0].description).toContain('number');
  });
});

describe('result shape', () => {
  test('every suggestion has content and description strings', () => {
    for (const text of ['', 'repo ', 'repo view ', 'issue list ']) {
      const results = suggest(text, { historyRepos: ['a/b'] });
      for (const s of results) {
        expect(typeof s.content).toBe('string');
        expect(typeof s.description).toBe('string');
      }
    }
  });
});
