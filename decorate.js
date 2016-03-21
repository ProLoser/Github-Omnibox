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

/**
 * Adds a gh-pages url if the branch exists but a url does not
 */
Decorator.prototype.addUrl = function() {
  
    var target, element, url, tooltip, text, classes = '', icon = '';
    // Is the project URL missing from the project description?
    if (!document.querySelector('.repository-meta-content [itemprop=url]') && (target = document.querySelector('.repository-meta-content [itemprop=about]'))) {

      element = document.createElement('span');

      // Is there a gh-pages branch?
      if (document.querySelector('[data-name="gh-pages"]')) {
        tooltip = "Detected from repo's gh-pages branch";
        url = this.owner + '.github.io';

        // Is this a webpage repo?
        if (!this.repo.endsWith('.github.io') && !this.repo.endsWith('.github.com'))
          url += '/' + this.repo;
      } else {
        // Add a 5minfork.com url
        // http://5minfork.com/musically-ut/lovely-forks
        url = '5minfork.com/' + this.owner + '/' + this.repo;
        text = '5minfork'
        tooltip = 'Create a 5 minute fork of the\n project for a quick play and test';
        icon = '<span class="octicon" style="width: 16px; height: 16px; margin-background-position: center; background-repeat: no-repeat; background-size: contain; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PgogICAgICAgICAgICAgICAgICAgIDwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIKICAgICAgICAgICAgICAgICAgICAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KICAgICAgICAgICAgICAgICAgICA8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iNTAuMCIgaGVpZ2h0PSI1Ny43NDI4NTQiPgogICAgICAgICAgICAgICAgICAgIDxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiIGlkPSJnODM0Ij4KICAgIDxwYXRoIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIHN0eWxlPSJmb250LXNpemU6eHgtc21hbGw7Zm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDt0ZXh0LWluZGVudDowO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1kZWNvcmF0aW9uOm5vbmU7bGluZS1oZWlnaHQ6bm9ybWFsO2xldHRlci1zcGFjaW5nOm5vcm1hbDt3b3JkLXNwYWNpbmc6bm9ybWFsO3RleHQtdHJhbnNmb3JtOm5vbmU7ZGlyZWN0aW9uOmx0cjtibG9jay1wcm9ncmVzc2lvbjp0Yjt3cml0aW5nLW1vZGU6bHItdGI7dGV4dC1hbmNob3I6c3RhcnQ7YmFzZWxpbmUtc2hpZnQ6YmFzZWxpbmU7Y29sb3I6IzAwMDAwMDtjb2xvci1pbnRlcnBvbGF0aW9uOnNSR0I7Y29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzOmxpbmVhclJHQjtmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjMxLjU0NzU3MzA5O21hcmtlcjpub25lO3Zpc2liaWxpdHk6dmlzaWJsZTtkaXNwbGF5OmlubGluZTtvdmVyZmxvdzp2aXNpYmxlO2VuYWJsZS1iYWNrZ3JvdW5kOmFjY3VtdWxhdGU7Y2xpcC1ydWxlOm5vbnplcm87Zm9udC1mYW1pbHk6c2Fucy1zZXJpZjstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOnNhbnMtc2VyaWYiIGlkPSJwYXRoODMyLTItNy01IiBkPSJNIDI1LjEwMTEzNywyIEMgMjEuMjU0MjY3LDIgMTguMDk5NTgsNS4xNDU3Njk5IDE4LjA5OTU4LDguOTg0NzEgMTguMDk5NTgsMTEuODU3NzU5IDE5Ljg2ODkxNCwxNC4zNDQzMDkgMjIuMzcwMjAzLDE1LjQxMzExOSBMIDIyLjM3MDIwMywyNi4zNjUwMTkgQyAyMC4wOTg0ODMsMjcuMzM2MDk5IDE4LjQwMDU5MywyOS40NzgxMzkgMTguMTM4OTA2LDMyLjA5MTAyOSAxNy43NTYzMTMsMzUuOTEwODU5IDIwLjU3NjYxNCwzOS4zNTU0MzkgMjQuNDA0MzUsMzkuNzM4ODA5IDI4LjIzMjA2OSw0MC4xMjIxODkgMzEuNjg2NDAxLDM3LjMwNDQyOSAzMi4wNjg5OTUsMzMuNDg0NTk5IDMyLjE2MTk0MiwzMi41NTY2MTkgMzIuMDY0NDk5LDMxLjY1NTA5OSAzMS44MTA1MjgsMzAuODA5ODM5IEwgMzcuOTE4NjMzLDI1LjczNTY2OSBDIDM4Ljc1MDMzNCwyNi4yMTYzOTkgMzkuNjkyNTY4LDI2LjUzMzI1OSA0MC43MDU3NzYsMjYuNjM0NzQ5IDQ0LjUzMzQ5NSwyNy4wMTgxMTkgNDcuOTg3ODI1LDI0LjIwMDM1OSA0OC4zNzA0MiwyMC4zODA1MjkgNDguNzUyOTk2LDE2LjU2MDY5OSA0NS45MjcwODMsMTMuMTE2MTE5IDQyLjA5OTM0NywxMi43MzI3MzkgMzguMjcxNjI5LDEyLjM0OTM2OSAzNC44MTcyOCwxNS4xNjcxMjkgMzQuNDM0NzA0LDE4Ljk4Njk1OSAzNC4zMzE3MjMsMjAuMDE1MDI5IDM0LjQ2NDQ2MywyMS4wMTU2MTkgMzQuNzgzMDk3LDIxLjkzNzA1OSBMIDI4LjgyMTA5MiwyNi44NzYzNjkgQyAyOC40NDY5MTMsMjYuNjQwMDM5IDI4LjA0OTA1NCwyNi40MzgyODkgMjcuNjI5ODEyLDI2LjI3NTEwOSBMIDI3LjYyOTgxMiwxNS40OTE3ODkgQyAzMC4yMzg2ODYsMTQuNDczNDk5IDMyLjEwMjcyNywxMS45MzUzODkgMzIuMTAyNzI3LDguOTg0NzEgMzIuMTAyNzI3LDUuMTQ1NzY5OSAyOC45NDgwMDUsMiAyNS4xMDExMzcsMiBaIE0gMjUuMTAxMTM3LDUuMjgxNjI5OSBDIDI3LjE2OTg0NCw1LjI4MTYyOTkgMjguODA5ODM1LDYuOTIwMjg5OSAyOC44MDk4MzUsOC45ODQ3MSAyOC44MDk4MzUsMTEuMDQ5MTMgMjcuMTY5ODQ0LDEyLjY4Nzc4OSAyNS4xMDExMzcsMTIuNjg3Nzg5IDIzLjAzMjQ0NywxMi42ODc3ODkgMjEuMzkyNDM4LDExLjA0OTEzIDIxLjM5MjQzOCw4Ljk4NDcxIDIxLjM5MjQzOCw2LjkyMDI4OTkgMjMuMDMyNDQ3LDUuMjgxNjI5OSAyNS4xMDExMzcsNS4yODE2Mjk5IFogTSAxMS40NTIwMSwxMS42NzA3MSBDIDQuMzE3ODQyMywxNi4yNzgzNjkgMCwyNC4yMDIzNTkgMCwzMi43MDM1MjkgMCw0Ni40OTA5OTkgMTEuMjMxODQ0LDU3Ljc0Mjg1NCAyNS4wMDAwMDksNTcuNzQyODU0IDM4Ljc2ODE3MSw1Ny43NDI4NTQgNDkuOTk5OTk5LDQ2LjQ5MDk5OSA0OS45OTk5OTksMzIuNzAzNTI5IEwgNDMuNDMxMTE2LDMyLjcwMzUyOSBDIDQzLjQzMTExNiw0Mi45MzU3OTkgMzUuMjE3OTQ1LDUxLjE2ODM0NCAyNS4wMDAwMDksNTEuMTY4MzQ0IDE0Ljc4MjA3Miw1MS4xNjgzNDQgNi41NzQ1MTEsNDIuOTM1Nzk5IDYuNTc0NTExLDMyLjcwMzUyOSA2LjU3NDUxMSwyNi40Mjg5NTkgOS43NDMzODQsMjAuNTk1MjU5IDE1LjAwODk4MSwxNy4xOTQ0MTkgTCAxMS40NTIwMSwxMS42NzA3MSBaIE0gNDEuMzkxMzIzLDE1Ljk4MDY2OSBDIDQxLjUxNzYwNywxNS45ODA3NDkgNDEuNjQ0NzkxLDE1Ljk5MDI1OSA0MS43NzM0MzIsMTYuMDAzMTM5IDQzLjgzMTgzNSwxNi4yMDkzMDkgNDUuMzAwMTM4LDE4LjAwMDQ2OSA0NS4wOTQ0MTEsMjAuMDU0NjE5IDQ0Ljg4ODY4NCwyMi4xMDg3NTkgNDMuMDkwMDc4LDIzLjU3NjEyOSA0MS4wMzE2OTIsMjMuMzY5OTY5IDM4Ljk3MzI4NywyMy4xNjM3OTkgMzcuNTA0OTg0LDIxLjM2NzAxOSAzNy43MTA3MTIsMTkuMzEyODc5IDM3LjkwMzYsMTcuMzg3MTE5IDM5LjQ5NzEwOSwxNS45Nzk0MjkgNDEuMzkxMzIzLDE1Ljk4MDY2OSBaIE0gMjUuMDg5OTE2LDI5LjA4NDcyOSBDIDI1LjIxNjE4MiwyOS4wODQ4MTkgMjUuMzQzMzY2LDI5LjA5NDMyOSAyNS40NzIwMjUsMjkuMTA3MjA5IDI3LjUzMDQyOCwyOS4zMTMzNzkgMjguOTk4NzMxLDMxLjEwNDUzOSAyOC43OTI5ODYsMzMuMTU4Njc5IDI4LjU4NzI2LDM1LjIxMjgyOSAyNi43ODg2NzEsMzYuNjgwMTk5IDI0LjczMDI4NSwzNi40NzQwMzkgMjIuNjcxODgsMzYuMjY3ODY5IDIxLjIwMzU1OSwzNC40NzEwODkgMjEuNDA5MzA0LDMyLjQxNjkzOSAyMS42MDIxOTMsMzAuNDkxMTc5IDIzLjE5NTcwMiwyOS4wODM0OTkgMjUuMDg5OTE2LDI5LjA4NDcyOSBaIi8+CiAgICA8cGF0aCBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiBzdHlsZT0iZm9udC1zaXplOnh4LXNtYWxsO2ZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7dGV4dC1pbmRlbnQ6MDt0ZXh0LWFsaWduOnN0YXJ0O3RleHQtZGVjb3JhdGlvbjpub25lO2xpbmUtaGVpZ2h0Om5vcm1hbDtsZXR0ZXItc3BhY2luZzpub3JtYWw7d29yZC1zcGFjaW5nOm5vcm1hbDt0ZXh0LXRyYW5zZm9ybTpub25lO2RpcmVjdGlvbjpsdHI7YmxvY2stcHJvZ3Jlc3Npb246dGI7d3JpdGluZy1tb2RlOmxyLXRiO3RleHQtYW5jaG9yOnN0YXJ0O2Jhc2VsaW5lLXNoaWZ0OmJhc2VsaW5lO2NvbG9yOiMwMDAwMDA7Y29sb3ItaW50ZXJwb2xhdGlvbjpzUkdCO2NvbG9yLWludGVycG9sYXRpb24tZmlsdGVyczpsaW5lYXJSR0I7ZmlsbDojMzMzMzMzO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDozMS41NDc1NzMwOTttYXJrZXI6bm9uZTt2aXNpYmlsaXR5OnZpc2libGU7ZGlzcGxheTppbmxpbmU7b3ZlcmZsb3c6dmlzaWJsZTtlbmFibGUtYmFja2dyb3VuZDphY2N1bXVsYXRlO2NsaXAtcnVsZTpub256ZXJvO2ZvbnQtZmFtaWx5OnNhbnMtc2VyaWY7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjpzYW5zLXNlcmlmIiBpZD0icGF0aDgzMi0yLTciIGQ9Ik0gMjUuMTAxMTM4LDAgQyAyMS4yNTQyNjgsMCAxOC4wOTk1ODEsMy4xNDU3NyAxOC4wOTk1ODEsNi45ODQ3MDk5IDE4LjA5OTU4MSw5Ljg1Nzc1OTUgMTkuODY4OTE1LDEyLjM0NDMxIDIyLjM3MDIwNCwxMy40MTMxMiBMIDIyLjM3MDIwNCwyNC4zNjUwMiBDIDIwLjA5ODQ4NCwyNS4zMzYxIDE4LjQwMDU5NCwyNy40NzgxNCAxOC4xMzg5MDcsMzAuMDkxMDMgMTcuNzU2MzE0LDMzLjkxMDg1OSAyMC41NzY2MTUsMzcuMzU1NDQgMjQuNDA0MzUxLDM3LjczODgxIDI4LjIzMjA3LDM4LjEyMjE5IDMxLjY4NjQwMiwzNS4zMDQ0MyAzMi4wNjg5OTYsMzEuNDg0NiAzMi4xNjE5NDMsMzAuNTU2NjIgMzIuMDY0NSwyOS42NTUxIDMxLjgxMDUyOSwyOC44MDk4NCBMIDM3LjkxODYzNCwyMy43MzU2NyBDIDM4Ljc1MDMzNSwyNC4yMTY0IDM5LjY5MjU2OSwyNC41MzMyNiA0MC43MDU3NzcsMjQuNjM0NzUgNDQuNTMzNDk2LDI1LjAxODEyIDQ3Ljk4NzgyNiwyMi4yMDAzNiA0OC4zNzA0MjEsMTguMzgwNTMgNDguNzUyOTk3LDE0LjU2MDcgNDUuOTI3MDg0LDExLjExNjEyIDQyLjA5OTM0OCwxMC43MzI3NCAzOC4yNzE2MywxMC4zNDkzNyAzNC44MTcyODEsMTMuMTY3MTMgMzQuNDM0NzA1LDE2Ljk4Njk2IDM0LjMzMTcyNCwxOC4wMTUwMyAzNC40NjQ0NjQsMTkuMDE1NjIgMzQuNzgzMDk4LDE5LjkzNzA2IEwgMjguODIxMDkzLDI0Ljg3NjM3IEMgMjguNDQ2OTE0LDI0LjY0MDA0IDI4LjA0OTA1NSwyNC40MzgyOSAyNy42Mjk4MTMsMjQuMjc1MTEgTCAyNy42Mjk4MTMsMTMuNDkxNzkgQyAzMC4yMzg2ODcsMTIuNDczNSAzMi4xMDI3MjgsOS45MzUzODk1IDMyLjEwMjcyOCw2Ljk4NDcwOTkgMzIuMTAyNzI4LDMuMTQ1NzcgMjguOTQ4MDA2LDAgMjUuMTAxMTM4LDAgWiBNIDI1LjEwMTEzOCwzLjI4MTYzIEMgMjcuMTY5ODQ1LDMuMjgxNjMgMjguODA5ODM2LDQuOTIwMjkgMjguODA5ODM2LDYuOTg0NzA5OSAyOC44MDk4MzYsOS4wNDkxMjk1IDI3LjE2OTg0NSwxMC42ODc3OSAyNS4xMDExMzgsMTAuNjg3NzkgMjMuMDMyNDQ4LDEwLjY4Nzc5IDIxLjM5MjQzOSw5LjA0OTEyOTUgMjEuMzkyNDM5LDYuOTg0NzA5OSAyMS4zOTI0MzksNC45MjAyOSAyMy4wMzI0NDgsMy4yODE2MyAyNS4xMDExMzgsMy4yODE2MyBaIE0gMTEuNDUyMDExLDkuNjcwNzA5NSBDIDQuMzE3ODQyMywxNC4yNzgzNyAwLDIyLjIwMjM2IDAsMzAuNzAzNTMgMCw0NC40OTA5OTkgMTEuMjMxODQ1LDU1Ljc0Mjg2IDI1LjAwMDAxLDU1Ljc0Mjg2IDM4Ljc2ODE3Miw1NS43NDI4NiA1MCw0NC40OTA5OTkgNTAsMzAuNzAzNTMgTCA0My40MzExMTcsMzAuNzAzNTMgQyA0My40MzExMTcsNDAuOTM1OCAzNS4yMTc5NDYsNDkuMTY4MzUgMjUuMDAwMDEsNDkuMTY4MzUgMTQuNzgyMDczLDQ5LjE2ODM1IDYuNTc0NTExLDQwLjkzNTggNi41NzQ1MTEsMzAuNzAzNTMgNi41NzQ1MTEsMjQuNDI4OTYgOS43NDMzODQ2LDE4LjU5NTI2IDE1LjAwODk4MiwxNS4xOTQ0MiBMIDExLjQ1MjAxMSw5LjY3MDcwOTUgWiBNIDQxLjM5MTMyNCwxMy45ODA2NyBDIDQxLjUxNzYwOCwxMy45ODA3NSA0MS42NDQ3OTIsMTMuOTkwMjYgNDEuNzczNDMzLDE0LjAwMzE0IDQzLjgzMTgzNiwxNC4yMDkzMSA0NS4zMDAxMzksMTYuMDAwNDcgNDUuMDk0NDEyLDE4LjA1NDYyIDQ0Ljg4ODY4NSwyMC4xMDg3NiA0My4wOTAwNzksMjEuNTc2MTMgNDEuMDMxNjkzLDIxLjM2OTk3IDM4Ljk3MzI4OCwyMS4xNjM4IDM3LjUwNDk4NSwxOS4zNjcwMiAzNy43MTA3MTMsMTcuMzEyODggMzcuOTAzNjAxLDE1LjM4NzEyIDM5LjQ5NzExLDEzLjk3OTQzIDQxLjM5MTMyNCwxMy45ODA2NyBaIE0gMjUuMDg5OTE3LDI3LjA4NDczIEMgMjUuMjE2MTgzLDI3LjA4NDgyIDI1LjM0MzM2NywyNy4wOTQzMyAyNS40NzIwMjYsMjcuMTA3MjEgMjcuNTMwNDI5LDI3LjMxMzM4IDI4Ljk5ODczMiwyOS4xMDQ1NCAyOC43OTI5ODcsMzEuMTU4NjggMjguNTg3MjYxLDMzLjIxMjgzIDI2Ljc4ODY3MiwzNC42ODAxOTkgMjQuNzMwMjg2LDM0LjQ3NDA0IDIyLjY3MTg4MSwzNC4yNjc4NyAyMS4yMDM1NiwzMi40NzEwOSAyMS40MDkzMDUsMzAuNDE2OTQgMjEuNjAyMTk0LDI4LjQ5MTE4IDIzLjE5NTcwMywyNy4wODM1IDI1LjA4OTkxNywyNy4wODQ3MyBaIi8+CiAgPC9nPgoKICAgICAgICAgICAgICAgICAgICA8L3N2Zz4=);"></span>';
        classes = 'btn btn-sm';
      }

      element.setAttribute('itemprop', 'url');
      element.innerHTML = ' <a href="http://'+url+'" class="tooltipped tooltipped-s ' + classes + '" aria-label="'+tooltip+'" style="white-space:nowrap">'
        + icon + ' ' + (text || url) + '</a>';
      target.parentNode.insertBefore(element, target.nextSibling);
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
