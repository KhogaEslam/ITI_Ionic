angular.module('chatApp').controller("publicChat", function($scope, $stateParams, $ionicScrollDelegate, $timeout, $http, Chat, $state, $rootScope, $ionicLoading) {
  $scope.chat = {};
  $scope.activeusersmessages = [];
  $scope.currentuser = {};
  var mydata;
  //Array contains objects [{'username' : username, 'msgContent' : msgContent, 'msgTime' : msgTime}]
  var username = JSON.parse(localStorage.getItem("username"));

  $scope.sendMessage = function() {
    // console.log($scope.chat.message);
    if($scope.chat.message != ''){
      //Chat.StartPublicChat(username, $scope.chat.message);
      if($stateParams.username){
        socket.emit("private_message", $stateParams.username, $scope.chat.message);
      }
      else{
        socket.emit("public_message", username, $scope.chat.message);
      }

      $scope.chat.message = "";
    }
  }
  if($stateParams.username){
    mydata = {'to':$stateParams.username, 'from': username};
  }

  Chat.getAllMessage(mydata).then(function(data) {
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
});
