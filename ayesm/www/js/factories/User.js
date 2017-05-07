angular.module("chatApp").factory("User", function($http, $q) {
  return {
    checkExisting: function(user) {
      var def = $q.defer()
      $http({
        url: "http://172.16.5.7:8080/api/login",
        method: 'POST',
        data: user
      }).then(function(res) {

        console.log(res);

          def.resolve(res.data)

      }, function(err) {
        def.reject(err);
      })
      return def.promise;
    },
    insertUser: function(userData) {
      $http({
        url: "http://172.16.5.7:8080/api/register",
        method: "POST",
        data: userData
      }).then(function(res) {
        if (res.status) {
          console.log(res.message);
        }
        console.log(res);
      }, function(err) {
        console.log(err);
      })
    },
    userData: function(user) {
      var def = $q.defer()
      $http({
        url: "http://172.16.5.7:8080/api/userdata",
        method: 'POST',
        data: user
      }).then(function(res) {
        console.log("userData: ",res);
        if(res.data.code == 8){
          var userData = {};
          userData['firstName'] = res.data.message[0].first_username;
          userData['lastName'] = res.data.message[0].last_username;
          console.log("User's Data: ",userData);
          def.resolve(userData)
        }
        else{
          def.resolve('error!')
        }
      }, function(err) {
        def.reject(err);
      })
      return def.promise;
    },
  }
})
