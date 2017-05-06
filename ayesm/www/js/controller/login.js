angular.module('chatApp').controller('login', function($scope, $state, $ionicPopup, User) {
  $scope.user = {};
  $scope.check={};
  $scope.login = function(valid) {
    if (valid) {
      var username = $scope.user.username;

      User.checkExisting($scope.user).then(function(data) {
        console.log(data);
        var exist=false//======>
        if (exist) {
          //user is exist go to active user
          if($scope.check.remember){
            localStorage.setItem('remember', JSON.stringify($scope.check.remember));
          }
          User.login(username)
          $state.go('app.activeUser')
        } else {
          $ionicPopup.show({
            template: 'Invaild Data!',
            title: 'Error',
            subTitle: '',
            scope: $scope,
            buttons: [{
                text: 'Try Agin',
                type: 'button-positive'
              },
              {
                text: 'Register',
                type: 'button-assertive',
                onTap: function() {
                  $state.go('register')
                }
              }
            ]
          });
        }
      }, function(err) {
        console.log(err);
      });
    }
  }
})
