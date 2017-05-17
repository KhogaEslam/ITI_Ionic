angular.module('chatApp').factory("Chat", function($q, $http) {

  return {

    getAllActiveUser: function(data) {
      var def = $q.defer();
      $http({
        url: 'http://172.16.5.7:8080/api/active',
        method: 'POST',
        data: data,

      }).then(function(res) {
        console.log(res);
        if (res.data.code == 5) {
          def.resolve(res.data)
        } else {
          def.reject('there is no data ')
        }

      }, function(err) {
        // console.log(err);
        def.reject(err);
      })
      return def.promise;

    },

    StartPublicChat: function(username, message) {
      socket.emit("public_message", username, message);
    },

    getAllMessage: function(mydata) {
      var def = $q.defer();
      var myurl = 'http://172.16.5.7:8080/api/';
      if(mydata){
        myurl += 'private_chat';
        console.log("private_chat",myurl,mydata);
      }
      else{
        myurl += 'getall';
        console.log("getall",myurl,mydata);
      }
      $http({
        url: myurl,
        method: 'POST',
        data: mydata
      }).then(function(res) {
        console.log("all message", res);
        if (res.data.length) {
          def.resolve(res.data)
        } else {
          def.reject('there is no data ')
        }

      }, function(err) {
        // console.log(err);
        def.reject(err);
      })
      return def.promise;
    },
  }
})
