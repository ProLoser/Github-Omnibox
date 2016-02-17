function Decorator() {
    // <span class="author"><a href="/proloser" class="url fn" itemprop="url" rel="author"><span itemprop="title">proloser</span></a></span>
    var author = document.querySelector('.author');
    this.owner = author.textContent;
    // <strong><a href="/proloser/github-omnibox" data-pjax="#js-repo-pjax-container">github-omnibox</a></strong>
    this.repo = author.nextElementSibling.nextElementSibling.textContent;

}
Decorator.prototype.owner = '';
Decorator.prototype.repo = '';

Decorator.prototype.isPublic = function() {
    var isPublic = document.querySelector('.entry-title');
    return isPublic && isPublic.classList.contains('public');
};


Decorator.prototype.img = function(src, alt, className) {
    return '<img src="'+src+'" alt="'+alt+'" class="'+className+'" />';
};

Decorator.prototype.row = function(data) {
    var tmpl = '<a class="select-menu-item js-navigation-item" title="'+data.name+'" role="menuitem" tabindex="0" href="'+data.url+'">' +
      this.img(data.icon, '', 'octicon select-menu-item-icon') +
      '<div class="select-menu-item-text">' +
        '<span class="select-menu-item-heading">' +
          (data.badge && this.img(data.badge, data.name) || data.name) +
        '</span>' +
      '</div>' +
    '</a>';
    return tmpl.replace(/:owner/g, this.owner).replace(/:repo/g, this.repo);
};

Decorator.prototype.addTab = function(items) {
  var target = document.querySelector('.reponav');
  if (!target) return;
  var element = document.createElement('span');
  element.className = 'select-menu js-menu-container js-select-menu dropdown';
  var tab = '<a class="reponav-item select-menu-button" href="#">' +
    '<svg height="16" width="12" xmlns="http://www.w3.org/2000/svg" class="octicon octicon-server">' +
      '<path d="M11 6H1c-0.55 0-1 0.45-1 1v2c0 0.55 0.45 1 1 1h10c0.55 0 1-0.45 1-1V7c0-0.55-0.45-1-1-1zM2 9H1V7h1v2z m2 0h-1V7h1v2z m2 0h-1V7h1v2z m2 0h-1V7h1v2zM11 1H1C0.45 1 0 1.45 0 2v2c0 0.55 0.45 1 1 1h10c0.55 0 1-0.45 1-1V2c0-0.55-0.45-1-1-1zM2 4H1V2h1v2z m2 0h-1V2h1v2z m2 0h-1V2h1v2z m2 0h-1V2h1v2z m3-1h-1v-1h1v1z m0 8H1c-0.55 0-1 0.45-1 1v2c0 0.55 0.45 1 1 1h10c0.55 0 1-0.45 1-1V12c0-0.55-0.45-1-1-1zM2 14H1V12h1v2z m2 0h-1V12h1v2z m2 0h-1V12h1v2z m2 0h-1V12h1v2z"></path>' +
    '</svg> Badges ' +
  '</a>' +
  '<div class="select-menu-modal-holder"><div class="select-menu-modal js-menu-content omnibox">' +
    '<div class="select-menu-header">' +
      '<a href="'+chrome.extension.getURL('help.html')+'">' +
      '<svg aria-hidden="true" class="octicon octicon-gear" height="16" role="img" version="1.1" viewBox="0 0 14 16" width="14">' +
        '<path d="M14 8.77V7.17l-1.94-0.64-0.45-1.09 0.88-1.84-1.13-1.13-1.81 0.91-1.09-0.45-0.69-1.92H6.17l-0.63 1.94-1.11 0.45-1.84-0.88-1.13 1.13 0.91 1.81-0.45 1.09L0 7.23v1.59l1.94 0.64 0.45 1.09-0.88 1.84 1.13 1.13 1.81-0.91 1.09 0.45 0.69 1.92h1.59l0.63-1.94 1.11-0.45 1.84 0.88 1.13-1.13-0.92-1.81 0.47-1.09 1.92-0.69zM7 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path>' +
      '</svg>' +
      '</a>' +
      '<span class="select-menu-title">Github Omnibox</span>' +
    '</div>' +
    '<div class="select-menu-list js-navigation-container" role="menu">' +
      items.map(this.row, this).join('') +
    '</div>' +
  '</div></div>';
  element.innerHTML = tab;
  target.appendChild(element);

  var trigger = element.querySelector('.select-menu-button');
  trigger.addEventListener('click', function(){
    trigger.classList.add('selected');
    element.classList.add('active');
    setTimeout(function(){
      document.addEventListener('click', function listener(){
        trigger.classList.remove('selected');
        element.classList.remove('active');
        document.removeEventListener('click', listener);
      });
    });
  });

  [].forEach.call(element.querySelectorAll('.reponav .select-menu-item-text img'), function(el){
      el.addEventListener('error', function(event){
          // event.srcElement.outerHTML = event.srcElement.alt;
          //    <img>      <span>        <div>           <a>
          event.srcElement.parentElement.parentElement.parentElement.outerHTML = '';
      });
  });
}

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
        icon: 'https://cdn03.gitter.im/_s/a46bec8/images/favicon.ico',
        badge: 'https://img.shields.io/gitter/room/:owner/:repo.svg',
        url: 'https://gitter.im/:owner/:repo'
    },
    {
        name: 'Travis CI',
        icon: 'https://cdn.travis-ci.org/images/favicon.png',
        badge: 'https://img.shields.io/travis/:owner/:repo.svg',
        url: 'https://travis-ci.org/:owner/:repo'
    },
    {
        name: 'David DM',
        icon: 'https://david-dm.org/favicon.ico',
        badge: 'https://img.shields.io/david/:owner/:repo.svg',
        url: 'https://david-dm.org/:owner/:repo'
    },
    {
        name: 'David DM Dev',
        icon: 'https://david-dm.org/favicon.ico',
        badge: 'https://img.shields.io/david/dev/:owner/:repo.svg',
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
        badge: 'https://img.shields.io/codeclimate/github/:owner/:repo.svg',
        url: 'https://codeclimate.com/github/:owner/:repo'
    }
];

var page = new Decorator();

if (page.isPublic()) {
    page.addUrl();
    chrome.storage.sync.get({menu:menu}, function(data){
      page.addTab(data.menu);
      $(document).on('pjax:complete', function() {
        page.addTab(data.menu);
      })
    });
}
