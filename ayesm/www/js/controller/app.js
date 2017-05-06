var socket=io.connect("http://172.16.5.7:8080/");
angular.module('chatApp').controller("app", function($scope,$state) {

  $scope.logout= function() {
    localStorage.removeItem('remember');
    $state.go('home');
  }

});
