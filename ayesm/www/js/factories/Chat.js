angular.module('chatApp').factory("Chat",function($q,$http){

return {

  getAllActiveUser:function(){

  			var def =$q.defer();
  			$http({
  				url:'' ,
  				method:'GET'

  			}).then(function(res){
  				// console.log(res);
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
