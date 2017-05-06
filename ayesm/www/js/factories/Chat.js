angular.module('chatApp').factory("Chat",function($q,$http){

return {

  getAllActiveUser:function(data){
  			var def =$q.defer();
  			$http({
  				url:'http://172.16.5.7:8080/api/active' ,
  				method:'POST',
          data: data,

  			}).then(function(res){
  				console.log(res);
  				if(res.data.message.users.length){
  					def.resolve(res.data)
  				}else{
  					def.reject('there is no data ')
  				}

  			},function(err){
  				// console.log(err);
  				def.reject(err);
  			})
  			return def.promise ;

  		},
      StartPublicChat:function(username,message){
          socket.emit("public_message",username,message);

        },

        getAllMessage:function(){
              var def =$q.defer();
              $http({
                url:'http://172.16.5.7:8080/api/getall' ,
                method:'POST',


              }).then(function(res){
                console.log(res);
                if(res.data.length){
                  def.resolve(res.data)
                }else{
                  def.reject('there is no data ')
                }

              },function(err){
                // console.log(err);
                def.reject(err);
              })
              return def.promise ;

            }


}})
