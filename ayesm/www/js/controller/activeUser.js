angular.module('chatApp').controller("activeUser",function($scope,$http,Chat,$state,$rootScope,$ionicLoading){
$ionicLoading.show();
$scope.activeusers = {};
//Array contains objects [{'username' : username, 'msgContent' : msgContent, 'msgTime' : msgTime}]
var username= JSON.parse(localStorage.getItem("username"));
socket.emit('logged',username);

Chat.getAllActiveUser({'username': username}).then(function(data){
  //console.log(data);
  console.log('username2',username);
  $scope.activeusers = data.message.users;
  console.log("active users1",$scope.activeusers);

$ionicLoading.hide()
} , function(err){
  console.log(err);
  console.log(JSON.stringify(err));
  $ionicLoading.hide();
});

socket.on('new_user',function(activeusers){
  $scope.activeusers = activeusers;
  console.log("active user",$scope.activeusers);
})

  });
