var module = angular.module('Help',[]);

var menu = [
    {
        name: 'Gitter Chat',
        icon: 'https://cdn01.gitter.im/_s/1b5c955/images/favicon5.png',
        badge: 'https://badges.gitter.im/:owner/:repo.png',
        url: 'https://gitter.im/:owner/:repo'
    },
    {
        name: 'Travis CI',
        icon: 'https://travis-ci.org/favicon.ico',
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
module.controller('Options', function($scope, $timeout) {
    chrome.storage.sync.get({menu:menu}, function(data){
        $scope.items = data.menu;
        $scope.$apply();
    });
    $scope.newItem = {};
    $scope.test = {
        owner: 'angular',
        repo: 'angular'
    };

    save = function(){
        $scope.saving = true;
        chrome.storage.sync.set({menu:$scope.items}, function(){
            console.log('saved');
            $scope.saving = false;
            $scope.saved = true;
            $timeout(function(){
                $scope.saved = false;
            }, 2000);
            $scope.$apply();
        });
    };
    $scope.save = function(){
        $scope.items.push($scope.newItem);
        $scope.newItem = {};
        save();
    };
    $scope.remove = function(index) {
        if (confirm('Are you sure?')) {
            $scope.items.splice(index, 1);
            save();
        }
    };
    $scope.up = function(index) {
        $scope.items.splice(index-1, 0, $scope.items.splice(index,1)[0]);
        save();
    };
    $scope.down = function(index) {
        $scope.items.splice(index+1, 0, $scope.items.splice(index,1)[0]);
        save();
    };
});

module.filter('test', function(){
    return function(string, owner, repo){
        if (!string) return;
        return string.replace(/:owner/g, owner).replace(/:repo/g, repo);
    };
});