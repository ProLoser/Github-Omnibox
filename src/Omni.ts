import _ from 'lodash';
import { Defer } from './Defer';
import { StepsManager } from './StepsManager';
import { getPatterns } from './patterns';

// This is a placeholder for the real OAuth2 implementation
// I will need to find a library for this or implement it.
class OAuth2 {
  constructor(private name: string, private config: any) {}
  authorize(callback: () => void) {
    console.log("Authorizing...");
    callback();
  }
  getAccessToken() { return "fake_token"; }
  clearAccessToken() {}
}

export class Omni {
  debug = false;
  urls = {
    github: 'https://github.com/',
    gist: 'https://gist.github.com/',
    api: 'https://api.github.com/',
    travis: 'https://travis-ci.org/',
    clone: 'github-mac://openRepo/https://github.com/',
    search: 'search?q=',
    io: (repo: string) => {
      const [owner, name] = repo.split('/');
      return `http://${owner}.github.io/${name}`;
    }
  };
  api: any;
  user: string = null;
  caches: any = {};
  authorized = false;

  constructor(authorized: boolean) {
    this.api = new OAuth2('github', {
      client_id: '9b3a55174a275a8b56ce',
      client_secret: 'aea80effa00cc2b98c1cc590ade40ba05cbeea1e',
      api_scope: 'repo'
    });

    if (authorized) {
      this.authorize();
    }
    this.clearCache();
    StepsManager.loadPatterns(getPatterns(this));
  }

  redirect(url: string, fullPath = false) {
    if (!fullPath && url.indexOf("://") === -1) {
      url = this.urls.github + url;
    }
    if (this.debug) {
      alert(url);
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.update(tabs[0].id, { url: url });
      });
    }
  }

  suggest(text: string, suggester: (suggestions: chrome.omnibox.SuggestResult[]) => void) {
    const suggestions = StepsManager.suggest(text);
    // The suggestion logic is complex and involves Defer.allDone.
    // I will implement this part next. For now, just log it.
    console.log("Suggestions:", suggestions);
    suggester([]);
  }

  decide(text: string) {
    const decision = StepsManager.decide(text);
    // The decision logic is also complex and involves Defer.eachDone.
    // I will implement this part next.
    console.log("Decision:", decision);
    if (typeof decision === 'string') {
        this.redirect(decision);
    }
  }

  authorize(callback?: () => void) {
    this.api.authorize(() => {
      this.reset();
      this.authorized = true;
      if (callback) callback();
    });
  }

  unauthorize() {
    if (this.api) {
      this.api.clearAccessToken();
    }
    this.reset();
    this.authorized = false;
  }

  query(options: any, callback: (err: any, data: any) => void) {
    // I will implement the fetch logic here later.
    console.log("Querying with:", options);
    callback(null, []);
  }

  reset() {
    this.clearCache();
    // Logic to fetch initial data will be added here.
  }

  clearCache() {
    this.caches = {
      suggestions: {},
      my: { repos: [], orgs: [], following: [], gists: [], starred: [] },
      their: { repos: {}, user: null }
    };
  }
}
