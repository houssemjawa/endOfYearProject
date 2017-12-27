var mainapp = angular.module("mainapp",['ngCookies','ngRoute']);
mainapp.config(['$routeProvider',function($routeProvider) {
$routeProvider
    .when('/login',{
        templateUrl: '/pfa_alpha/web/views/html/login/test.html',
        controller : 'authCtrl'
    })


    .otherwise(
        {
            redirectTo:'/login' ,
            controller: 'authCtrl'
        }) ;

}]) ;

mainapp.controller("authCtrl",function($scope,$http,$cookieStore){
/***********************************************/
$scope.submit = function(){
  $http({
        url: '/api/login_check',
        method: 'POST',
        data : {
         _username:$scope.username,
         _password:$scope.password
       }
     }).success(function(response){
       console.log(response);

            if(typeof($cookieStore.get('token')) == 'undefined'){
                $cookieStore.put('token',response.token);
console.log('ok')
            }

            if(typeof($cookieStore.get('token')) != 'undefined'){
               console.log("I am here");
             $http({
               url: '/signin',
               method: 'POST',
               data : {
                 username:$scope.username,
                 password:$scope.password,
                 token:$cookieStore.get('token')
               }
             }).success(function(response){

             });
             }
           //console.log(token);
      });








};
/*****************************************************************/
$scope.profile = function(){

    $http({
      url: '/pfAlpha//web/app_dev.php/profile',
      method: 'POST',
      data : {
        token:$cookieStore.get('token')
      }
  }).success(function(response){
    $scope.result=response;
    console.log($cookieStore.get('token'));
    console.log($scope.result);
  });

};
/*******************************************************************/
$scope.accueil = function(){




}
/********************************************************************/
$scope.logout = function(){
  $http({
    url: '/disconnect/'+$cookieStore.get('token'),
    method: '/pfAlpha//web/app_dev.php/DELETE',
}).response(function(response){
  console.log(response);
  $cookieStore.remove('token');
});
};
/**********************************************************************/



/***********************/

    $scope.register = function () {
        $http({
            url: '/pfAlpha/web/app_dev.php/register',
            method: 'POST',
            data: {
                username: $scope.username,
                email: $scope.email,
                password: $scope.password,
                adresse: $scope.adresse,
                prenom: $scope.prenom,
                nom: $scope.nom,
                phone: $scope.phone
            }
        }).success(function (response) {
            console.log('ok');
            console.log(response);
        });


    };
});
