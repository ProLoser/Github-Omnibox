var heading = document.querySelector('.js-current-repository');

var items = [
	{ img: 'https://secure.travis-ci.org/{owner}/{repo}.png', url: 'http://travis-ci.org/{owner}/{repo}' },
	{ img: 'https://david-dm.org/{owner}/{repo}.png', url: 'https://david-dm.org/{owner}/{repo}' }
];

if (!heading || !items || !items.length) return;

var tokens = heading.href.split('/').slice(-2);

items.forEach(function(item){
  var img = document.createElement('img');
  img.src = item.img.replace('{owner}', tokens[0]).replace('{repo}', tokens[1]);
  var link = document.createElement('a')
  link.appendChild(img);
  link.href = item.url.replace('{owner}', tokens[0]).replace('{repo}', tokens[1]);
  link.setAttribute('style', 'margin-left:5px');
  heading.parentElement.appendChild(link);
});