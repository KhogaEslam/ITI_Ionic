var apiKey = "AIzaSyAvjm90jPnyajnltubdNWG2ZKaUqyGnGmU";

angular.module('chatApp').controller("app", function($scope,$state, User, $ionicPopup, $ionicPush) {
  $ionicPush.register().then(function(t) {
    return $ionicPush.saveToken(t);
  }).then(function(t) {
    console.log('Token saved:', t.token);
  });
  var username= JSON.parse(localStorage.getItem("username"));
  $scope.currentStatus = {'text':'Online', 'checked': true};
  $scope.toggleStatus = function() {
    $scope.currentStatus.text = ($scope.currentStatus.checked ? 'Online' : 'Offline');
    socket.emit('toggle_status');
    console.log("toggle_status");
  }

  socket.on("disconnect", function() {
    $state.go("login");
  })

  User.userData({'username': username}).then(function(data){
    console.log('user data:::',data);
    $scope.firstName = data.firstName;
    $scope.lastName = data.lastName;
  } , function(err){
    console.log(err);
    console.log(JSON.stringify(err));
  });

  $scope.logout = function() {
    $ionicPush.unregister();
    socket.emit('logout',username)
    localStorage.removeItem('remember');
    localStorage.removeItem('username');
    $state.go('home');
  }

  $scope.$on('cloud:push:notification', function(event, data) {
    var msg = data.message;
    alert(msg.title + ': ' + msg.text);
  });

});
