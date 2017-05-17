angular.module('chatApp').controller("activeUser",function($scope,$http,Chat,$state,$rootScope,$ionicLoading, $timeout){
$ionicLoading.show();
$scope.activeusers = {};
//Array contains objects [{'username' : username, 'msgContent' : msgContent, 'msgTime' : msgTime}]
var username= JSON.parse(localStorage.getItem("username"));
socket.emit('logged',username);

Chat.getAllActiveUser({'username': username}).then(function(data){
  $timeout(function(){
  //console.log(data);
  console.log('username2',data.message.users, username);
  delete data.message.users[username];
  $scope.activeusers = data.message.users;
  console.log("active users1",$scope.activeusers);

  $ionicLoading.hide()
});
} , function(err){
  console.log(err);
  console.log(JSON.stringify(err));
  $ionicLoading.hide();
});

socket.on('online_users', function(users) {
  $timeout(function() {
    console.log("users", users);
    delete users[username];
    $scope.activeusers = users;
    console.log("$scope.activeusers", $scope.activeusers);
  });
});

socket.on('new_user',function(activeusers){
  $timeout(function(){
    console.log("active user4",$scope.activeusers,username);
    delete activeusers[username];
    $scope.activeusers = activeusers;
    console.log("active user",$scope.activeusers);
  });
})

  });
