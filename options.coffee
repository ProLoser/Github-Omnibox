window.options = ($scope, $timeout) ->
  $scope.data = angular.copy localStorage

  $scope.save = (connect) ->
    angular.extend localStorage, $scope.data
    $scope.saved = true
    $timeout ->
      $scope.saved = false
    , 2000
    if (connect)
      $scope.connect()

  $scope.clear = ->
    $scope.data = {
      username: ''
      password: ''
    }
    $scope.save()
    $scope.disconnect()

  $scope.connect = ->
    $scope.error = false
    github = new Github(
      username: localStorage.username
      password: localStorage.password
      auth: "basic"
    )
    github.getUser().repos (err) ->
      if err
        $scope.error = JSON.parse(err.request.response).message
      else
        chrome.extension.sendRequest "connect"


  $scope.disconnect = ->
    chrome.extension.sendRequest "disconnect"