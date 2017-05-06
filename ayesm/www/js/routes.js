angular.module('chatApp').config(function($stateProvider) {
  $stateProvider

    .state('app', {
      url: '/app',
      templateUrl: 'templates/app.html',
      controller: 'app',
      abstract: true
    })


    .state('home', {
      url: '',
      templateUrl: 'templates/home.html',
      controller: 'home',
    })

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'login'
    })

    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'register'
    })


    .state('app.about', {
      url: '/about',
      views: {
        "pageContent": {
          templateUrl: "templates/about.html"
        }
      }
    })

    .state('app.chat', {
      url: '/chat',
      views: {
        "pageContent": {
          templateUrl: "templates/chat.html",
          controller: "activeUser"
        }
      }
    })

    .state('app.activeUser', {
      url: '/activeuser',
      views: {
        "pageContent": {
          templateUrl: "templates/activeUser.html",
          controller: "activeUser"
        }
      }
    })

})
