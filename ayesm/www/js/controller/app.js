angular.module('chatApp').controller("app", function($scope,$state) {

  $scope.logout= function() {
    localStorage.removeItem('remember');
    if (localStorage.getItem('user')) {
      localStorage.removeItem('user');
    }
    $state.go('home');
  }

});
