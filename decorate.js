function Decorator() {
    var mainRepoLink = document.querySelector('.js-current-repository');
    var tokens = mainRepoLink && mainRepoLink.href.split('/').slice(-2);
    this.owner = tokens[0];
    this.repo = tokens[1];

}
Decorator.prototype.owner = '';
Decorator.prototype.repo = '';

Decorator.prototype.isPublic = function() {
    var isPublic = document.querySelector('.entry-title');
    return isPublic && isPublic.classList.contains('public');
};


Decorator.prototype.img = function(src, alt) {
    return '<img src="'+src+'" alt="'+alt+'" />';
};

Decorator.prototype.row = function(data) {
    var isIconUrl = data.icon && data.icon.substr(0, 4) == 'http';

    var icon;

    if (isIconUrl)
        icon = '<span class="octicon">' + this.img(data.icon, data.name) + '</span>';
    else
        icon = '<span class="octicon octicon-' + data.icon +'"></span>';

    var tmpl = '<li class="github-omnibox-sidebar-item tooltipped tooltipped-w" aria-label="'+data.name+'"> \
        <a href="'+data.url+'" class="sunken-menu-item">'+icon+' \
            <span class="full-word">'+ (data.badge && this.img(data.badge, data.name) || data.name) +'</span> \
        </a> \
    </li>';
    return tmpl.replace(/:owner/g, this.owner).replace(/:repo/g, this.repo);
};

Decorator.prototype.addMenu = function(items) {
    var target = document.querySelector('.sunken-menu');
    if (!target) return;
    var element = document.createElement('div');
    element.className = 'sunken-menu-separator';
    target.appendChild(element);
    element = document.createElement('ul');
    element.className = 'sunken-menu-group omnibox-menu';
    element.innerHTML = items.map(this.row, this).join('');

    [].forEach.call(element.querySelectorAll('img'), function(el){
        el.addEventListener('error', function(event){
            // event.srcElement.outerHTML = event.srcElement.alt;
            //    <img>      <span>        <a>           <li>
            event.srcElement.parentElement.parentElement.parentElement.outerHTML = '';
        });
    });

    target.appendChild(element);
};

Decorator.prototype.addUrl = function() {
    // Is there a gh-pages branch but no project URL?
    if (!document.querySelector('.repository-website') && document.querySelector('[data-name="gh-pages"]')) {
        var target = document.querySelector('.repository-description');
        if (target) {
            element = document.createElement('div');

            var url = this.owner + '.github.io';
            if (!this.repo.endsWith('.github.io') && !this.repo.endsWith('.github.com'))
                url += '/' + this.repo;
            element.className = 'repository-website js-details-show';
            element.innerHTML = '<p><a href="http://'+url+'" class="edit-link">'+url+'</a></p>';
            target.parentNode.insertBefore(element, target.nextSibling);
        }
    }
};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var menu = [
    {
        name: 'Gitter Chat',
        icon: 'https://cdn01.gitter.im/_s/1b5c955/images/favicon5.png',
        badge: 'https://badges.gitter.im/:owner/:repo.png',
        url: 'https://gitter.im/:owner/:repo'
    },
    {
        name: 'Travis CI',
        icon: 'https://travis-ci-org.global.ssl.fastly.net/images/favicon-04004642a94f6c2b0d4a567fb5dbe145.png',
        badge: 'https://api.travis-ci.org/:owner/:repo.svg',
        url: 'https://travis-ci.org/:owner/:repo'
    },
    {
        name: 'Gemnasium',
        icon: 'https://assets.gemnasium.com/assets/favicon.png',
        badge: 'https://david-dm.org/:owner/:repo.svg',
        url: 'https://david-dm.org/:owner/:repo'
    },
    {
        name: 'David DM',
        icon: 'https://david-dm.org/favicon.ico',
        badge: 'https://david-dm.org/:owner/:repo.svg',
        url: 'https://david-dm.org/:owner/:repo'
    },
    {
        name: 'David DM Dev',
        icon: 'https://david-dm.org/favicon.ico',
        badge: 'https://david-dm.org/:owner/:repo/dev-status.svg',
        url: 'https://david-dm.org/:owner/:repo#info=devDependencies'
    },
    {
        name: 'Coveralls',
        icon: 'https://coveralls.io/favicon.ico',
        badge: 'https://img.shields.io/coveralls/:owner/:repo.svg',
        url: 'https://coveralls.io/r/:owner/:repo'
    },
    {
        name: 'Code Climate',
        icon: 'https://codeclimate.com/favicon.ico',
        badge: 'https://codeclimate.com/github/:owner/:repo.svg',
        url: 'https://codeclimate.com/github/:owner/:repo'
    },
    {
        name: 'Github Omnibox',
        icon: 'tools',
        url: chrome.extension.getURL('help.html')
    }
];

var page = new Decorator();

if (page.isPublic()) {
    page.addUrl();
    chrome.storage.sync.get({menu:menu}, function(data){
        page.addMenu(data.menu);
    });
}