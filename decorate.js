var heading = document.querySelector('.js-current-repository');

if (!heading) return;


chrome.extension.onRequest.addListener(function (items/*, sender, sendResponse*/) {
	if (typeof items === 'object') {
        var tokens = heading.href.split('/').slice(-2);

		for (var item in items) {
			if (item === 'setup') continue;
			var img = document.createElement('img');
			img.src = items[item].replace('{owner}', tokens[0]).replace('{repo}', tokens[1]);
			var link = document.createElement('a')
			link.appendChild(img);
			link.href = item.url.replace('{owner}', tokens[0]).replace('{repo}', tokens[1]);
			link.setAttribute('style', 'margin-left:5px');
			heading.parentElement.appendChild(link);
		};
    }
});

chrome.extension.sendRequest('decorate');

