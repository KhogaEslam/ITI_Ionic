angular.module('chatApp').controller('register', function($scope, $state, $ionicPopup, User) {
  $scope.user = {};
  $scope.signup = function(valid) {
    if (valid) {
      if ($scope.user['password'].length > 4) {
        $scope.pass_error = false;
        $scope.repass_error = false;

        User.checkExisting().then(function(data) {
          console.log(data);
          var exist =data.code
          if (exist==2) {
            User.insertUser($scope.user);
            $state.go('login')
          } else {
            $ionicPopup.show({
              template: 'User name already exists',
              title: 'Error',
              subTitle: '',
              scope: $scope,
              buttons: [{
                  text: 'Try Agin',
                  type: 'button-positive'
                },
                {
                  text: 'Has account',
                  type: 'button-assertive',
                  onTap: function() {
                    $state.go('login')
                  }
                }
              ]
            });
          }



        }, function(err) {
          console.log(err);
        });
      } else {
        $scope.pass_error = true;
      }
    }
  }
})
