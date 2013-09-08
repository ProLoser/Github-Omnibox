var menu = '<li class="github-omnibox-sidebar-item tooltipped leftwards" title="Travis CI"> \
        <a href="http://travis-ci.org/{owner}/{repo}"> \
            <span class="octicon github-omnibox-icon-travis"><img src="http://travis-ci.org/favicon.ico"></span> \
            <span class="full-word"><img src="https://secure.travis-ci.org/{owner}/{repo}.png"></span> \
        </a> \
    </li> \
    <li class="github-omnibox-sidebar-item tooltipped leftwards" title="Gemnasium"> \
        <a href="https://gemnasium.com/{owner}/{repo}"> \
            <span class="octicon github-omnibox-icon-david"><img src="https://gemnasium.com/favicon.png"></span> \
            <span class="full-word"><img src="https://gemnasium.com/{owner}/{repo}.png"></span> \
        </a> \
    </li>';

/*
Coveralls:
    <li class="github-omnibox-sidebar-item tooltipped leftwards" title="Coveralls"> \
        <a href="https://coveralls.io/r/{owner}/{repo}"> \
            <span class="octicon github-omnibox-icon-david"><img src="http://coveralls.io/favicon.ico"></span> \
            <span class="full-word"><img src="https://coveralls.io/repos/{owner}/{repo}/badge.png"></span> \
        </a> \
    </li> \
*/ 

var target = document.querySelector('.repo-nav-contents');

if (target) {

    var tokens = document.querySelector('.js-repo-home-link').href.split('/').slice(-2);

    menu = menu.replace(/\{owner\}/g, tokens[0]).replace(/\{repo\}/g, tokens[1]);

    var element = document.createElement('div');
    element.className = 'repo-menu-separator';
    target.appendChild(element);
    element = document.createElement('ul');
    element.className = 'repo-menu';
    element.innerHTML = menu;

    target.appendChild(element);

}