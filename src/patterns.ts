import { Defer } from './Defer';
import { StepValue } from './Step';
import { StepsManager } from './StepsManager';

export const getPatterns = (omni: any): { [key: string]: StepValue } => {
  const suggestOwnRoad = function () {
    return {
      content: this.getRoad(),
      description: this.getRoad().replace(/my (.+)/, "<dim>my</dim> <url>$1</url>"),
    };
  };

  const decideWithUser = (url: string) => () => omni.user + url;

  const getFullRepo = (args: string[]): Defer<string> => {
    const defer = new Defer<string>();
    const firstArg = args[0];
    if (firstArg[0] === "!") {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        const tab = tabs[0];
        const match = tab.url.match(/github\.com\/(([\w-]+)\/([\-\w\.]+))/) || tab.url.match(/([\w-]+)\.github\.io\/([\-\w\.]+)/);
        if (match) {
          defer.resolve(match[1].replace('.github.io', ''));
        }
      });
    } else if (firstArg[0] === "/") {
      defer.resolve(omni.user + "/" + firstArg.substring(1));
    } else if (firstArg[0] === "*") {
      const repoName = firstArg.substring(1).toLowerCase();
      const repo = omni.caches.starred.find((r: any) => r.name.toLowerCase() === repoName);
      defer.resolve(repo ? repo.full_name : null);
    } else {
      defer.resolve(firstArg);
    }
    return defer;
  };

  const filterRepos = (repos: any[], text: string, inclusive = false) => {
    const filteredRepos = [];
    repos.forEach((repo) => {
      if (!inclusive && repo.name.toLowerCase() === text.toLowerCase()) return;
      const findName = repo.name.toLowerCase().indexOf(text);
      if (findName !== -1) {
        filteredRepos[findName === 0 ? 'unshift' : 'push']({
          content: repo.full_name,
          description: repo.full_name.replace(new RegExp(text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'ig'), '<match>$&</match>')
        });
      }
    });
    return filteredRepos;
  };

  const suggestOwnLabel = function (args) {
    const prefix = this.value.prefix ? `<dim>${this.value.prefix}</dim>` : "";
    if (args[0][0] === "!") {
      return { content: this.label, description: `${prefix}<url>${this.label.substring(1)}</url>` };
    } else {
      return { content: `${args[0]} ${this.label}`, description: `${prefix}<match>${args[0]}</match> <url>${this.label}</url>` };
    }
  };

  const decideFromLabel = function (args) {
    let label = this.label;
    if (label[0] === "!") label = label.substring(1);
    return getFullRepo(args).done((fullRepo) => `${fullRepo}/${label}`);
  };

  const decideBranchPath = (args) => {
    let branch = "master", path = null;
    args.forEach((val) => {
      val = val.replace("!", "");
      if (val[0] === "@") branch = val.substring(1);
      else if (val[0] === "/") path = val.substring(1);
    });
    return getFullRepo(args).done((fullRepo) => {
      if (path === null) return `${fullRepo}/tree/${branch}`;
      if (path === "") return `${fullRepo}/find/${branch}`;
      return `${fullRepo}/blob/${branch}/${path}`;
    });
  };

  const suggestGist = (user, id) => {
    const suggestions = [];
    user = user.toLowerCase();
    omni.caches.my.gists.forEach((gist) => {
        if (gist.user.login.toLowerCase() === user && (!id || gist.id.indexOf(id) === 0)) {
            const url = `${gist.user.login}/${gist.id}`;
            suggestions.push({
                content: `gist ${url}`,
                description: `<dim>gist</dim> <url>${url}</url>: <dim>${gist.description.split('&').join('&amp;')}</dim>`
            });
        }
    });
    return suggestions;
  };

  const repoActions: StepValue = { /* ... full repoActions object ... */ };

  const allPatterns: { [key: string]: StepValue } = {
    help: { /* ... */ },
    my: { /* ... */ },
    "new": { /* ... */ },
    "user/repo": { /* ... */ },
    "/repo": {
        pattern: /^\/[\-\w\.]*/,
        suggest: function (args) {
            const repoName = args[0].substring(1).toLowerCase();
            const myRepos = filterRepos(omni.caches.my.repos, repoName, true);
            if (myRepos[0] && myRepos[0].content.split('/')[0] !== omni.user) {
                myRepos.unshift({ content: args[0], description: `${omni.user}<match>${args[0]}</match>` });
            }
            return myRepos;
        },
        decide: (args) => {
            const repoName = args[0].substring(1).toLowerCase();
            const repo = omni.caches.my.repos.find((r:any) => r.name.toLowerCase() === repoName);
            if (repo) return repo.full_name;
            return `${omni.user}/${repoName}`;
        },
        children: repoActions
    },
    "*starred_repo": { /* ... */ },
    gist: {
        suggest: () => ({ content: "gist", description: "gist" }),
        decide: () => omni.urls.gist + omni.user,
        children: {
            id: { pattern: /^[a-z0-9]+$/, suggest: (args) => suggestGist(omni.user, args[1]), decide: (args) => `${omni.urls.gist}${args[1]}`},
            "/id": { pattern: /^\/[a-z0-9]+$/, suggest: (args) => suggestGist(omni.user, args[1]), decide: (args) => `${omni.urls.gist}${omni.user}/${args[1]}`},
            "user/id": { pattern: /^[\w-]+\/[a-z0-9]+$/, suggest: (args) => { const i = args[1].split("/"); return suggestGist(i[0], i[1]); }, decide: (args) => `${omni.urls.gist}${args[1]}` },
            "user/": { pattern: /^[\w-]+\/?$/, suggest: (args) => { /* ... */ }, decide: (args) => `${omni.urls.gist}${args[1].replace("/", "")}` }
        }
    },
  };

  return allPatterns;
};
