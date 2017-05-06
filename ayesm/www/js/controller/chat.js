angular.module('chatApp').controller("publicChat", function($scope, $http, Chat, $state, $rootScope, $ionicLoading) {
  $scope.chat = {};
  //Array contains objects [{'username' : username, 'msgContent' : msgContent, 'msgTime' : msgTime}]
  var username = localStorage.getItem("username");
  // Chat.StartPublicChat(username,"");
  $scope.sendMessage = function() {
    // console.log($scope.chat.message);
    Chat.StartPublicChat(username, $scope.chat.message);
    $scope.chat.message = "";

  }

  Chat.getAllMessage().then(function(data) {
console.log(data);
    $scope.activeusersmessages = data;

  }, function(err) {
    console.log(err);
    console.log(JSON.stringify(err));

  });



});
