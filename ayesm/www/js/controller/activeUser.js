angular.module('chatApp').controller("activeUser",function($scope,$http,Chat,$state,$rootScope,$ionicLoading){
$ionicLoading.show()


//Array contains objects [{'username' : username, 'msgContent' : msgContent, 'msgTime' : msgTime}]

Chat.getAllActiveUser().then(function(data){
  console.log(data);
  $scope.activeusers=data;

$ionicLoading.hide()
} , function(err){
  console.log(err);
  alert(err);

});


  });
