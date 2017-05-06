angular.module("chatApp").factory("User", function($http, $q) {
  return {
    checkExisting: function(user) {
      var def = $q.defer()
      $http({
        url: "",
        method: 'GET',
        data: user
      }).then(function(res) {
        console.log(res);
        if (res.data.length) {
          def.resolve(res.data)
        }
      }, function(err) {
        def.reject(err);
      })
      return def.promise;
    },
    insertUser: function(userData) {
      $http({
        url: "",
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
    login: function(user) {
      $http({
        url: "",
        method: "POST",
        data: user
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
