angular.module('chatApp').controller("publicChat", function($scope,  $ionicScrollDelegate, $timeout, $http, Chat, $state, $rootScope, $ionicLoading) {
  $scope.chat = {};
  $scope.activeusersmessages = {};
  $scope.currentuser = {};
  //Array contains objects [{'username' : username, 'msgContent' : msgContent, 'msgTime' : msgTime}]
  var username = JSON.parse(localStorage.getItem("username"));

  $scope.sendMessage = function() {
    // console.log($scope.chat.message);
    if($scope.chat.message != ''){
      //Chat.StartPublicChat(username, $scope.chat.message);
      socket.emit("public_message", username, $scope.chat.message);
      $scope.chat.message = "";
    }
  }

  Chat.getAllMessage().then(function(data) {
    console.log("data", data);
    $scope.activeusersmessages = data;
    $scope.currentuser = username;
    $ionicScrollDelegate.scrollBottom();
  }, function(err) {
    console.log(err);
    console.log(JSON.stringify(err));
  });

  socket.on('messages',function(msgs){
    $timeout(function(){
      $scope.activeusersmessages.push(msgs);
      console.log("all active users msgs",msgs);
      $ionicScrollDelegate.scrollBottom();
    })
  });

  // private_message
  // $scope.sendPrivateMessage = function() {
  //
  //   Chat.StartPrivateChat(username, $scope.chat.message);
  //   $scope.chat.message = "";
  //
  // }


});
