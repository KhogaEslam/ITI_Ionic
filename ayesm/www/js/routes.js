angular.module('chatApp').config(function($stateProvider) {
  $stateProvider

  .state('app',{
    url:'/app',
    templateUrl:'templates/app.html',
    controller:'app',
    abstract:true
  })


  .state('home',{
    url:'',
    templateUrl:'templates/home.html'
  })

  .state('login',{
    url:'/login',
    templateUrl:'templates/login.html',
    controller:'login'
  })

  .state('register',{
    url:'/register',
    templateUrl:'templates/register.html',
    controller:'register'
  })



})
