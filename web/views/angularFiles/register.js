var registerApp = angular.module('registerApp',[
  'ngRoute','ngCookies']);

registerApp.config(['$routeProvider',function($routeProvider) {
    $routeProvider
        .when('/success',{
            templateUrl: '/pfa_alpha/web/views/404/done.html',
            controller : 'registerCtrl'
        })
        .when('/profile',{
          templateUrl: '/pfa_alpha/web/views/html/login/profile.html',
          controller : 'registerCtrl'
      })
        .when('/inscription',{
            templateUrl: '/pfa_alpha/web/views/html/login/views/inscription.html',
            controller : 'registerCtrl'
        })
        .when('/error',{
            templateUrl: '/pfa_alpha/web/views/404/404.html',
            controller : 'registerCtrl'
        })
        .when('/login',{
            templateUrl: '/pfa_alpha/web/views/html/login/views/login.html',
            controller : 'registerCtrl'
        })
        .when('/500', {
            templateUrl: '/pfa_alpha/web/views/404/404.html',
            controller: 'registerCtrl'
        }) .otherwise({
        redirectTo: '/login' ,
            controller: 'registerCtrl'
    })
}]) ;
registerApp.controller("registerCtrl",function($scope,$http,$cookieStore,$cookies){

  $scope.$on('LOAD',function(){$scope.loading=true});
  $scope.$on('UNLOAD',function(){$scope.loading=false});


/***********************************************************************************/
$scope.register = function(){
  $http({
          method: 'POST',
          url: '/pfa_alpha/web/app_dev.php/register',
          headers: {
              'Content-Type': undefined
          },
          data: {
              file : $scope.file,
              username:$scope.username,
              email:$scope.email,
              password:$scope.password,
              adresse : $scope.adresse,
              prenom : $scope.prenom,
              nom : $scope.nom,
              phone : $scope.phone
},
          transformRequest: function (data, headersGetter) {
              var formData = new FormData();
              angular.forEach(data, function (value, key) {
                  formData.append(key, value);
              });

              var headers = headersGetter();
              delete headers['Content-Type'];

              return formData;
          }
      })
      .success(function (data) {
        window.location = '#/success' ;
      })
      .error(function (data, status) {
        window.location = '#/error' ;
      });
};

/***********************************************/

$scope.submit = function(){
  $http({
        url: '/pfa_alpha/web/app_dev.php/api/login_check',
        method: 'POST',
        data : {
         _username: $scope.username,
         _password: $scope.password
       }
     }).success(function(response){
   

            if(typeof($cookies.get('token')) == 'undefined'){
                $cookies.put('token',response.token);
             localStorage.set("token", JSON.stringify($cookies.get('token')));

            }
            if(typeof($cookies.get('token')) != 'undefined'){
             localStorage.setItem("token",$cookies.get('token'));
             $http({
               url: '/pfa_alpha/web/app_dev.php/signin',
               method: 'POST',
               data : {
                 username:$scope.username,
                 password:$scope.password,
                 token:$cookies.get('token')
               }
             }).success(function(response){
              window.location = '#/profile' ;

             });
           }
      });
};
/*****************************************************************/
$scope.profile = function(){
console.log($cookies.get('token'))
      $http({
        url: '/pfa_alpha/web/app_dev.php/profile',
        method: 'POST',
        data : {
        token: $cookies.get('token')
        }
    }).success(function(response){ 
      $scope.result=response;
        console.log(response) ;
    });
  };
/*******************************************************************/
$scope.getonepage = function(id){
  $http({
    url : '/pfa_alpha/web/app_dev.php/page/'+id,
    method : 'GET'
  }).success(function(response){
    $scope.page = response;
    $cookieStore.remove('id',response.id) ;
    $cookieStore.put('id',response.id) ;
  });
};
//$scope.id_page = $cookieStore.get('id');
/********************************************************************/
$scope.logout = function(){
  $http({
    url: '/pfa_alpha/web/app_dev.php/disconnect/'+$cookieStore.get('token'),
    method: 'DELETE',
}).success(function(response){
  console.log(response);
  $cookieStore.remove('token');
});
};
/**********************************************************************/
$scope.search = function(){
  $http({
    url : '/pfa_alpha/web/app_dev.php/search/'+$scope.donnee,
    method: 'GET'
  }).success(function(response){
    $scope.pages = response;
    $cookieStore.put('pages',response);
  });
};
/***********************************************************************/
$scope.like = function(id){
  $http({
    url : '/pfa_alpha/web/app_dev.php/like/'+id,
    method : 'POST',
    data : {
      token : $cookieStore.get('token')
    }
  }).success(function(response){
    console.log(response);
  });
};
/************************************************************************/
$scope.isAdmin = function(){
  console.log("smthng")
  $http({
    url : '/pfa_alpha/web/app_dev.php/isadmin/'+$cookieStore.get('token')+'/'+$cookieStore.get('id'),
    method : 'GET'
  }).success(function(response){
    $scope.isad = response.response;
    console.log(response);
  });
};
/************************************************************************/
$scope.postpublication = function(){
  $http({
          method: 'POST',
          url: '/pfa_alpha/web/app_dev.php/register/page',
          headers: {
              'Content-Type': 'multipart/form-data'
          },
          data: {
              content : $scope.content ,
              token : $cookieStore.get('token'),
              file : $scope.file
          },
          transformRequest: function (data, headersGetter) {
              var formData = new FormData();
              angular.forEach(data, function (value, key) {
                  formData.append(key, value);
              });
              var headers = headersGetter();
              delete headers['Content-Type'];
              return formData;
          }
      })
      .success(function (data) {

      })
      .error(function (data, status) {

      });
};
/********************************************************************************/

/********************************************************************************/
});
registerApp.directive('file', function () {
    return {
        scope: {
            file: '='
        },
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var file = event.target.files[0];
                scope.file = file ? file : undefined;
                scope.$apply();
            });
        }
    };
})
