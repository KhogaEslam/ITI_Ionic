angular.module('chatApp').controller("activeUser",function($scope,$http,Chat,$state,$rootScope,$ionicLoading){
$ionicLoading.show()
//Array contains objects [{'username' : username, 'msgContent' : msgContent, 'msgTime' : msgTime}]
var username= localStorage.getItem("username");
Chat.getAllActiveUser({username: username}).then(function(data){
  //console.log(data);
  console.log('username2',username);
  $scope.activeusers=data.message.users;
  console.log($scope.activeusers);

$ionicLoading.hide()
} , function(err){
  console.log(err);
  console.log(JSON.stringify(err));
  $ionicLoading.hide();
});



  });
