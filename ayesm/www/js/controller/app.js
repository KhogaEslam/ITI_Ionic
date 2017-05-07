var socket=io.connect("http://172.16.5.7:8080/");
angular.module('chatApp').controller("app", function($scope,$state) {

  $scope.logout = function() {
    var username= JSON.parse(localStorage.getItem("username"));
    socket.emit('logout',username)
    localStorage.removeItem('remember');
    localStorage.removeItem('username');
    $state.go('home');
  }

});
