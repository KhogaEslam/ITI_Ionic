angular.module('chatApp').controller("app", function($scope, $state) {

  $scope.logout = function() {
    localStorage.removeItem('remember');
    localStorage.removeItem('user');
    $state.go('home');
  }

});
