var module = angular.module('Help',[]);

var menu = [
    {
        name: 'Gitter Chat',
        icon: 'https://gitter.im/favicon.ico',
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
module.controller('Options', function($scope, $timeout, $q) {
    chrome.storage.sync.get({menu:menu}, function(data){
        $scope.items = data.menu;
        $scope.$apply();
    });
    $scope.test = {
        owner: 'angular',
        repo: 'angular'
    };

    var timer = $q.when();
    save = function(){
        $scope.saving = true;
        chrome.storage.sync.set({menu:$scope.items}, function(){
            $scope.saving = false;
            $scope.saved = true;
            $timeout.cancel(timer);
            timer = $timeout(function(){
                $scope.saved = false;
            }, 2000);
            $scope.$apply();
        });
    };
    $scope.isNumber = angular.isNumber;
    $scope.save = function(){
        if (angular.isNumber($scope.editingIndex))
            $scope.items[$scope.editingIndex] = $scope.formItem;
        else
            $scope.items.push($scope.formItem);
        save();
        $scope.reset();
    };
    $scope.edit = function(index) {
        $scope.formItem = angular.copy($scope.items[index]);
        $scope.editingIndex = index;
    };

    $scope.reset = function() {
        $scope.editingIndex = null;
        $scope.formItem = {};
    };
    $scope.reset();

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
    $scope.resetCache = function() {
        chrome.runtime.sendMessage(null, 'reset');
    };
    $scope.login = function() {
      chrome.runtime.sendMessage(null, 'login');
    };
    $scope.logout = function() {
      chrome.runtime.sendMessage(null, 'logout');
    }
});

module.filter('test', function(){
    return function(string, owner, repo){
        if (!string) return;
        return string.replace(/:owner/g, owner).replace(/:repo/g, repo);
    };
});
