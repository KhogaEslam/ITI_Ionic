angular.module('chatApp').controller('home', function($state) {
  if (localStorage.getItem('remember')=="true") {
    console.log(localStorage.getItem('remember'));
    $state.go('app.activeUser');
  }
})
