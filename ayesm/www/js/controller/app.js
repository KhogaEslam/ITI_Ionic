angular.module('chatApp').controller("app", function($scope,$state) {

  $scope.logout= function() {
    localStorage.removeItem('remember');
    $state.go('home');
  }

});
