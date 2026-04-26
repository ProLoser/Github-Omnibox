# GitHub Omnibox — v2

A completely rewritten Chrome extension that lets you navigate GitHub directly
from the address bar using the same command syntax as the **[GitHub CLI (`gh`)](https://cli.github.com/manual/)**.

No login, no API token, no cache — suggestions are sourced from your **browser
history** and GitHub's **public Search API**.

---

## Usage

Type `gh` followed by `Space` or `Tab` in Chrome's address bar to activate.

```
gh <command> <subcommand> [args...]
```

| Command | Example | Navigates to |
|---------|---------|--------------|
| `repo view` | `repo view facebook/react` | `github.com/facebook/react` |
| `repo list` | `repo list microsoft` | `github.com/microsoft` |
| `repo create` | `repo create` | `github.com/new` |
| `repo fork` | `repo fork facebook/react` | `github.com/facebook/react/fork` |
| `repo rename` | `repo rename facebook/react` | `github.com/facebook/react/settings` |
| `issue list` | `issue list facebook/react` | `github.com/facebook/react/issues` |
| `issue view` | `issue view facebook/react 42` | `github.com/facebook/react/issues/42` |
| `issue create` | `issue create facebook/react` | `github.com/facebook/react/issues/new` |
| `pr list` | `pr list facebook/react` | `github.com/facebook/react/pulls` |
| `pr view` | `pr view facebook/react 7` | `github.com/facebook/react/pull/7` |
| `pr create` | `pr create facebook/react` | `github.com/facebook/react/compare` |
| `release list` | `release list facebook/react` | `github.com/facebook/react/releases` |
| `release view` | `release view facebook/react v18.0.0` | `github.com/facebook/react/releases/tag/v18.0.0` |
| `release create` | `release create facebook/react` | `github.com/facebook/react/releases/new` |
| `gist list` | `gist list` | `gist.github.com` |
| `gist view` | `gist view abc123` | `gist.github.com/abc123` |
| `gist create` | `gist create` | `gist.github.com` |
| `workflow list` | `workflow list facebook/react` | `github.com/facebook/react/actions` |
| `run list` | `run list facebook/react` | `github.com/facebook/react/actions` |
| `search repos` | `search repos react hooks` | `github.com/search?q=react+hooks&type=repositories` |
| `search issues` | `search issues memory leak` | `github.com/search?q=memory+leak&type=issues` |
| `search prs` | `search prs chore deps` | `github.com/search?q=chore+deps&type=pullrequests` |
| `search code` | `search code useState` | `github.com/search?q=useState&type=code` |

**Shorthand**: if you type `owner/repo` directly (no command), it navigates
straight to `github.com/owner/repo`.

---

## Architecture

```
new/
├── manifest.json        Chrome MV3 manifest (keyword: gh, no OAuth)
├── background.js        Service worker — wires omnibox events
├── src/
│   ├── commands.js      gh CLI–aligned command tree + URL builders (pure)
│   ├── parser.js        Input tokeniser (pure)
│   ├── suggest.js       Suggestion engine — commands + history + search (pure)
│   ├── navigate.js      URL resolver for onInputEntered (pure)
│   ├── history.js       Browser-history wrapper (injectable dep)
│   └── search.js        GitHub Search API wrapper (injectable dep, no auth)
└── test/
    ├── commands.test.js
    ├── parser.test.js
    ├── suggest.test.js
    ├── navigate.test.js
    ├── history.test.js
    └── search.test.js
```

### Design principles

* **Pure functions everywhere** — `commands.js`, `parser.js`, `suggest.js`,
  and `navigate.js` have zero side-effects and are trivially unit-testable.
* **Injectable dependencies** — `history.js` and `search.js` accept the
  `chrome.history.search` / `fetch` function as a parameter, making them
  mockable without a browser.
* **No caching, no auth** — suggestions come from browser history (instant,
  free) and GitHub's public Search API (no token needed).
* **Manifest V3** — modern service-worker–based background script.

---

## Installation (development)

1. Copy the `new/` folder to your machine.
2. Copy the icon files from the parent `images/` directory into `new/images/`.
3. Open `chrome://extensions`, enable **Developer mode**.
4. Click **Load unpacked** and select the `new/` folder.

---

## Running tests

```bash
cd new/
npm install
npm test
```

Requires Node.js ≥ 18.
