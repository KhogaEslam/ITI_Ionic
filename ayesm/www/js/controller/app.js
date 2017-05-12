
var serverUrl = "http://172.16.5.7:8080"; // Server IP Address and port number

var socket=io.connect(serverUrl, {'transports': ['websocket']});
angular.module('chatApp').controller("app", function($scope,$state, User) {

  var username= JSON.parse(localStorage.getItem("username"));
  $scope.currentStatus = {'text':'Online', 'checked': true};
  $scope.toggleStatus = function() {
    $scope.currentStatus.text = ($scope.currentStatus.checked ? 'Online' : 'Offline');
    socket.emit('toggle_status');
    console.log("toggle_status");
  }

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
