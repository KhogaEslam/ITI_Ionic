var socket=io.connect("http://172.16.5.7:8080/");
angular.module('chatApp').controller("app", function($scope,$state, User) {

  var username= JSON.parse(localStorage.getItem("username"));

  User.userData({'username': username}).then(function(data){
    console.log('user data:::',data);
    $scope.firstName = data.firstName;
    $scope.lastName = data.lastName;
  } , function(err){
    console.log(err);
    console.log(JSON.stringify(err));
  });

  $scope.logout = function() {
    socket.emit('logout',username)
    localStorage.removeItem('remember');
    localStorage.removeItem('username');
    $state.go('home');
  }

});
