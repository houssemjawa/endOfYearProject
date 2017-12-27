//ng-click="openInfoWindow($event, marker)"

TuniCoolApp.config(['$routeProvider',function($routeProvider) {


   $routeProvider
        .when('/home',{
            templateUrl: '/pfa_alpha/web/views/html/principale/Views/index.html',
            controller : 'ArticleController'


        })

       .when('/Restaurant/:nomRestaurant',{
      templateUrl: '/pfa_alpha/web/views/html/RestaurantPage/Views/Restaurant.html',
      controller : 'RestaurantController'
      })
      .when('/article/:NomArticle',{
      templateUrl: '/pfa_alpha/web/views/html/RestaurantPage/Views/Publication1.html',
      controller: 'RestaurantController'
      })

        .when('/PublicationNotFound', {
        templateUrl: '/pfa_alpha/web/views/html/RestaurantPage/Views/test.html',
            controller: 'RestaurantController'
    })
       


        .when('/Recherche/map',{
    templateUrl: '/pfa_alpha/web/views/html/principale/Views/map/Recherche.html',
     controller : 'MapCtrl'
        })


        .when('/404', {
            templateUrl: '/pfa_alpha/web/views/404/404.html',
            controller: 'ArticleController'
        })
        .when('/500', {
            templateUrl: '/pfa_alpha/web/views/404/404.html',
            controller: 'ArticleController'
        }) 
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
//===============Route etablissement ==========================//
 .when('/etablissment',{
            templateUrl: '/pfa_alpha/web/views/admin/views/addPage1.html',
            controller : 'AdminCtrl'

        })
        .when('/description',{
            templateUrl: '/pfa_alpha/web/views/admin/views/Articles.html',
            controller : 'ACtrl'
        })
   
        .when('/aide',{
            templateUrl: '/pfa_alpha/web/views/admin/views/aide.html',
            controller : 'AdminCtrl'

        })
        .when('/article',{
            templateUrl: '/pfa_alpha/web/views/admin/views/addArticle.html',
            controller : 'ACtrl'
        })
        .when('/admin/article/:NomArticle',{
            templateUrl: '/pfa_alpha/web/views/admin/views/listPublication1.html',
            controller : 'ACtrl'
        })

         .when('/admin/article/:NomArticlep/:publication_id',{
            templateUrl: '/pfa_alpha/web/views/admin/views/addPublication.html',
            controller : 'ACtrl'
        })
        .otherwise({
        redirectTo: '/home' ,
            controller: 'ArticleController'
    })






}]) ;
