angular.module('chatApp').controller("app", function($scope,$state) {

  $scope.logout= function() {
    $state.go('home');

  }

});
