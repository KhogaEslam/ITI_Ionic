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
    }
  }
})
