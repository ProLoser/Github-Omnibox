var menu = '<li class="github-omnibox-sidebar-item tooltipped leftwards" title="Travis CI"> \
        <a href="https://travis-ci.org/{owner}/{repo}"> \
            <span class="octicon"><img src="https://travis-ci.org/favicon.ico"></span> \
            <span class="full-word"><img src="https://secure.travis-ci.org/{owner}/{repo}.png" alt="Travis CI"></span> \
        </a> \
    </li> \
    <li class="github-omnibox-sidebar-item tooltipped leftwards" title="Gemnasium"> \
        <a href="https://gemnasium.com/{owner}/{repo}"> \
            <span class="octicon"><img src="https://gemnasium.com/favicon.png"></span> \
            <span class="full-word"><img src="https://gemnasium.com/{owner}/{repo}.png" alt="Gemnasium"></span> \
        </a> \
    </li> \
    <li class="github-omnibox-sidebar-item tooltipped leftwards" title="David DM"> \
        <a href="https://david-dm.org/{owner}/{repo}"> \
            <span class="octicon"><img src="https://david-dm.org/favicon.ico"></span> \
            <span class="full-word"><img src="https://david-dm.org/{owner}/{repo}.png" alt="David DM"></span> \
        </a> \
    </li> \
    <li class="github-omnibox-sidebar-item tooltipped leftwards" title="David DM Dev"> \
        <a href="https://david-dm.org/{owner}/{repo}#info=devDependencies"> \
            <span class="octicon"><img src="https://david-dm.org/favicon.ico"></span> \
            <span class="full-word"><img src="https://david-dm.org/{owner}/{repo}/dev-status.png" alt="David DM Dev"></span> \
        </a> \
    </li> \
    <li class="github-omnibox-sidebar-item tooltipped leftwards" title="Coveralls"> \
        <a href="https://coveralls.io/r/{owner}/{repo}"> \
            <span class="octicon"><img src="https://coveralls.io/favicon.ico"></span> \
            <span class="full-word"><img src="https://coveralls.io/repos/{owner}/{repo}/badge.png" alt="Coveralls"></span> \
        </a> \
    </li>';

// The navigation sidebar
var target = document.querySelector('.repo-nav-contents');
// Contains a 'public' or 'private' class for the repo
var isPublic = document.querySelector('.entry-title');

if (target && isPublic && isPublic.classList.contains('public')) {

    var tokens = document.querySelector('.js-repo-home-link').href.split('/').slice(-2);

    menu = menu.replace(/\{owner\}/g, tokens[0]).replace(/\{repo\}/g, tokens[1]);

    var element = document.createElement('div');
    element.className = 'repo-menu-separator';
    target.appendChild(element);
    element = document.createElement('ul');
    element.className = 'repo-menu';
    element.innerHTML = menu;

    [].forEach.call(element.querySelectorAll('img'), function(el){
        el.addEventListener('error', function(event){
            event.srcElement.outerHTML = event.srcElement.alt;
        });
    });

    target.appendChild(element);

}