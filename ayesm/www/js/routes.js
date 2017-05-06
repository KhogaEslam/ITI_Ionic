angular.module('chatApp').config(function($stateProvider){
$stateProvider
.state('app',{
url:'/app',templateUrl:"templates/app.html",
abstract:true,
controller:"app"

})

.state('app.about',{
url:'/about',
views:{
  "pageContent":{
    templateUrl:"templates/about.html"
  }
}
})

.state('app.chat',{
url:'/chat',
views:{
  "pageContent":{
    templateUrl:"templates/chat.html",
    controller:"activeUser"
  }
}
})

.state('app.activeUser',{
url:'/activeUser',
views:{
  "pageContent":{
    templateUrl:"templates/activeUser.html",
    controller:"activeUser"
  }
}
})

})
