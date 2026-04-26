import { resolve } from '../src/navigate.js';
import { COMMANDS, makeCommands } from '../src/commands.js';

function nav(text) {
  return resolve(text, COMMANDS);
}

const GHE = 'https://github.myco.com';
const gheCommands = makeCommands(GHE);
function gheNav(text) {
  return resolve(text, gheCommands, GHE);
}

describe('resolve – known commands', () => {
  test('repo view → repository page', () => {
    expect(nav('repo view facebook/react')).toBe('https://github.com/facebook/react');
  });

  test('repo create → new repository page', () => {
    expect(nav('repo create')).toBe('https://github.com/new');
  });

  test('repo fork → fork page', () => {
    expect(nav('repo fork facebook/react')).toBe('https://github.com/facebook/react/fork');
  });

  test('repo rename → settings page', () => {
    expect(nav('repo rename facebook/react')).toBe('https://github.com/facebook/react/settings');
  });

  test('issue list → issues page', () => {
    expect(nav('issue list facebook/react')).toBe('https://github.com/facebook/react/issues');
  });

  test('issue view → specific issue', () => {
    expect(nav('issue view facebook/react 42')).toBe('https://github.com/facebook/react/issues/42');
  });

  test('issue create → new issue form', () => {
    expect(nav('issue create facebook/react')).toBe('https://github.com/facebook/react/issues/new');
  });

  test('pr list → pulls page', () => {
    expect(nav('pr list facebook/react')).toBe('https://github.com/facebook/react/pulls');
  });

  test('pr view → specific PR', () => {
    expect(nav('pr view facebook/react 7')).toBe('https://github.com/facebook/react/pull/7');
  });

  test('pr create → compare page', () => {
    expect(nav('pr create facebook/react')).toBe('https://github.com/facebook/react/compare');
  });

  test('release list → releases page', () => {
    expect(nav('release list facebook/react')).toBe('https://github.com/facebook/react/releases');
  });

  test('release view with tag → specific release', () => {
    expect(nav('release view facebook/react v18.0.0')).toBe('https://github.com/facebook/react/releases/tag/v18.0.0');
  });

  test('release view without tag → latest release', () => {
    expect(nav('release view facebook/react')).toBe('https://github.com/facebook/react/releases/latest');
  });

  test('release create → new release form', () => {
    expect(nav('release create facebook/react')).toBe('https://github.com/facebook/react/releases/new');
  });

  test('gist list → gist.github.com', () => {
    expect(nav('gist list')).toBe('https://gist.github.com');
  });

  test('gist view → specific gist', () => {
    expect(nav('gist view abc123')).toBe('https://gist.github.com/abc123');
  });

  test('gist create → gist.github.com', () => {
    expect(nav('gist create')).toBe('https://gist.github.com');
  });

  test('workflow list → actions page', () => {
    expect(nav('workflow list facebook/react')).toBe('https://github.com/facebook/react/actions');
  });

  test('run list → actions page', () => {
    expect(nav('run list facebook/react')).toBe('https://github.com/facebook/react/actions');
  });

  test('search repos → GitHub search repositories', () => {
    expect(nav('search repos react hooks')).toBe(
      'https://github.com/search?q=react%20hooks&type=repositories',
    );
  });

  test('search issues → GitHub search issues', () => {
    expect(nav('search issues memory leak')).toBe(
      'https://github.com/search?q=memory%20leak&type=issues',
    );
  });

  test('search prs → GitHub search pull requests', () => {
    expect(nav('search prs chore deps')).toBe(
      'https://github.com/search?q=chore%20deps&type=pullrequests',
    );
  });

  test('search code → GitHub search code', () => {
    expect(nav('search code useState hook')).toBe(
      'https://github.com/search?q=useState%20hook&type=code',
    );
  });
});

describe('resolve – shortcuts and fallbacks', () => {
  test('empty string → GitHub home', () => {
    expect(nav('')).toBe('https://github.com');
  });

  test('owner/repo shorthand navigates directly', () => {
    expect(nav('facebook/react')).toBe('https://github.com/facebook/react');
  });

  test('unknown command falls back to GitHub search', () => {
    const url = nav('nope view foo');
    expect(url).toContain('github.com/search');
    expect(url).toContain('nope');
  });

  test('unknown subcommand falls back to GitHub search', () => {
    const url = nav('repo unknowncmd foo');
    expect(url).toContain('github.com/search');
  });

  test('trailing spaces are handled gracefully', () => {
    expect(nav('repo create   ')).toBe('https://github.com/new');
    expect(nav('repo view facebook/react  ')).toBe('https://github.com/facebook/react');
  });
});

describe('resolve – GitHub Enterprise base URL', () => {
  test('empty string → GHE home', () => {
    expect(gheNav('')).toBe(GHE);
  });

  test('repo view uses GHE base', () => {
    expect(gheNav('repo view myorg/myrepo')).toBe(`${GHE}/myorg/myrepo`);
  });

  test('issue list uses GHE base', () => {
    expect(gheNav('issue list myorg/myrepo')).toBe(`${GHE}/myorg/myrepo/issues`);
  });

  test('pr view uses GHE base', () => {
    expect(gheNav('pr view myorg/myrepo 7')).toBe(`${GHE}/myorg/myrepo/pull/7`);
  });

  test('owner/repo shorthand navigates to GHE', () => {
    expect(gheNav('myorg/myrepo')).toBe(`${GHE}/myorg/myrepo`);
  });

  test('unknown command falls back to GHE search', () => {
    const url = gheNav('nope view foo');
    expect(url).toContain(`${GHE}/search`);
    expect(url).not.toContain('github.com');
  });

  test('search repos uses GHE base', () => {
    expect(gheNav('search repos react hooks')).toBe(
      `${GHE}/search?q=react%20hooks&type=repositories`,
    );
  });
});
