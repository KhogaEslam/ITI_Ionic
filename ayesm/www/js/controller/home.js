angular.module('chatApp').controller('home', function($state) {
  if (localStorage.getItem('remember')=="true") {
    console.log(localStorage.getItem('remember'));
    console.log('toz');
    $state.go('app.activeUser');
    console.log('eslam');
  }
})
