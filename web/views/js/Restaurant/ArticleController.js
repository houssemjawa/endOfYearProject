var ArticleModel =angular.module('ArticleModel',['ngRoute']) ;


ArticleModel.config(['$routeProvider',function($routeProvider) {

      $routeProvider
      .when('/Restaurant/:nomRestaurant',{
      templateUrl: '/pfa_alpha/web/views/html/RestaurantPage/Views/Restaurant.html',
      controller : 'RestaurantController'
      })
      .when('/article/:NomArticle',{
      templateUrl: '/pfa_alpha/web/views/html/RestaurantPage/Views/Publication1.html',
      controller: 'RestaurantController'
      })
      .when('/404', {
      templateUrl: '/pfa_alpha/web/views/404/404.html',
      controller: 'RestaurantController'
      })
      .when('/500', {
      templateUrl: '/pfa_alpha/web/views/404/404.html',
      controller: 'RestaurantController'
      })
          .when('/PublicationNotFound', {
        templateUrl: '/pfa_alpha/web/views/html/RestaurantPage/Views/test.html',
            controller: 'RestaurantController'

    })

      .otherwise(
      {
      redirectTo:'/404' ,
          controller: 'RestaurantController'
      }) ;

      }]) ;




    ArticleModel.controller('RestaurantController',  function ($scope, $filter,$http, $routeParams) {

        //========================================================================
        var listRestaurant = function () {
            $http({
                method: 'GET',
                url: '/pfa_alpha/web/app_dev.php/list'
            }).then(function (res) {
                $scope.Restaurants = res.response;
            });
        };
//======================================================/search==================
        var GetResta = function (nomRestaurant) {
            $http.get('/pfa_alpha/web/app_dev.php/search/' + nomRestaurant).success(function (response) {
              $scope.Restaurant = response[0];
console.log($scope.Restaurant.categorie) ;
console.log($scope.Restaurant.categorie) ;
            });
        };
        $scope.GetRestaurant =  function (){
          GetResta($routeParams.nomRestaurant);
        }

        //========================================================================
        var Article = function (nomResto) {
            $scope.$emit('LOAD');
            $http({
                method: 'GET',
                url: '/pfa_alpha/web/app_dev.php/' + nomResto + '/Articles'

            }).success(function (response) {
                $scope.$emit('UNLOAD');
                $scope.Articles = response;
                data = angular.copy(response);
                var image = [];
                for (x in response) image.push(response[x].path);
                //  ======RadomIMAGE======
                $scope.RadomImage1 = Radom(image);
                $scope.RadomImage2 = Radom(image);
                $scope.RadomImage3 = Radom(image);
                $scope.RadomImage4 = Radom(image);
                //  ======Silde IMAGE======
                $scope.SildRadom1 = Radom(image);
                $scope.SildRadom2 = Radom(image);
                $scope.SildRadom3 = Radom(image);
  })
                .error(function () {

                    window.location = "#/404";

                })

        };

        $scope.ListArticle = function () {
            Article($routeParams.nomRestaurant);

        };





        //========================================================================
        $scope.pub = function (NomArticle) {
            $scope.$emit('LOAD');
            $http.get('/pfa_alpha/web/app_dev.php/' + NomArticle + '/publications').success(function (response) {

                $scope.$emit('UNLOAD');

                window.location = '#/article/' + NomArticle;
                $scope.publications = response;
                $scope.NomArticle = NomArticle;
                $scope.IdArticle = response[0].idArticle;
                console.log(idArticle);
                $scope.ImageArticle = response[0].image;



            })
                .error(function () {
                    window.location = "#/PublicationNotFound";


                })

        };
        var publica = function (NomArticle,num_publicat) {
            $http.get('/pfa_alpha/web/app_dev.php/' + NomArticle + '/publications').success(function (response) {
                window.location = '#/article/' + NomArticle;
                $scope.publications = response;
                $scope.NomArticle = NomArticle;
                $scope.IdArticle = response[0].idArticle;
                $scope.publication = response[num_publicat];
                $scope.publicationID = $scope.publication.id ;
                $scope.ImageArticle = response[0].path;
                $scope.TypeArticle = response[0].type ;
                $scope.PrixArticle = response[0].prix ;
                ListComme($scope.publicationID) ;
            })
                .error(function () {
                    console.log(NomArticle);
                    window.location = "#/404";

                })

        };

        $scope.Listpublication = function (num_publicat) {

            publica($routeParams.NomArticle,num_publicat);


        };
        $scope.numberpublication = function (num_publicat) {

            publica($routeParams.NomArticle,num_publicat);

        }




        //========================================================================


        $scope.getAll = listRestaurant();
        $scope.postlistRestaurant = function () {
            $http({
                method: 'POST',
                url: '/pfAlpha/web/app_dev.php/api/Restaurant',
                data: {
                    nom: $scope.nom,
                    prix: $scope.prix
                }
            }).success(function (response) {
                $scope.name = "";
                $scope.password = "";
                $scope.pub($routeParams.NomArticle);
            });
        };

        $scope.postPublication = function (id_article) {
            $http({
                method: 'POST',
                url: '/pfa_alpha/web/app_dev.php/' + id_article + '/publication',
                data: {
                    Contenue: $scope.contenue
                }
            }).success(function () {

                $scope.contenue = "";
                Listpublication();

            })
                .error(function (response) {
                    window.location = "#/404";
                })

        };

        var EtidierPublication = function(Nom_Article,id_publication) {
            $http({

                method: 'PUT',
                url: '/pfa_alpha/web/app_dev.php/'+ Nom_Article + '/publication/' + id_publication,
                data: {
                    Contenue: $scope.contenue
                }
            }).success(function () {

                $scope.contenue = " ";
                //publica(Nom_Article,id_publication);
                $scope.Listpublication(id_publication) ;
                console.log('ok')

            })
        }

        $scope.EtidierPublication = function(id_publication)
        {

            EtidierPublication($routeParams.NomArticle,id_publication) ;
        }
//========================================================================
        var DeletePub = function (Nom_Article, Publication_id) {
            $http({
                method: 'DELETE',
                url: '/pfa_alpha/web/app_dev.php/' + Nom_Article + '/publication/' + Publication_id
            }).success(function () {
                Listpublication();
            })

        };


        $scope.DeletePublication = function (Publication_id) {
            DeletePub($routeParams.NomArticle, Publication_id);
        }
        //==================================Commantaire======================================

       var ListComme = function (idPublication) {
            $http.get('/pfa_alpha/web/app_dev.php/' + idPublication + '/Commentaires')
                .success(function (response) {

                    $scope.listeCommentaire = response;

                })
        }


        var Commentaire = function () {

            var listpublication = Listpublication();
            var IdPublication = [];
            for (id in listpublication) idPublication.push(listpublication[id].id)
        }


        var suprimerCommentaire = function (id_Publication,Commentaire_id) {
            $http({
                method:'DELETE' ,
                url: '/pfa_alpha/web/app_dev.php/'+id_Publication+'/Commentaire/'+Commentaire_id

            }).success(function(response){
                ListComme(id_Publication) ;
                console.log('suprime')
            })
        }
        $scope.suprimerCommentaire = function(Commentaire_id) {
            suprimerCommentaire($scope.publicationID,Commentaire_id);
        }
//==================================POSTCommantaire======================================
         var Postcommentaire = function (idPublication) {
console.log(idPublication) ;

            $http({

                method: 'POST',
                url: '/pfa_alpha/web/app_dev.php/' + idPublication + '/Commentaire',
                data: {
                    commentaire: $scope.contenue1
                }
            }).success(function (response) {
                console.log($scope.publicationID) ;

                $scope.contenue1 = "";
                ListComme(idPublication);
            })
                .error(function (response) {
               console.log($scope.contenue1);
                })
        }
       $scope.Postcommentaire =  function()
       {

           Postcommentaire($scope.publicationID) ;
       }

//===================== Radom===================================================

        var Radom = function (imgArr) {

            return imgArr[Math.floor(Math.random() * (imgArr.length))];
        }

        //======================================Pagination==================================

        $scope.currentPage = 0;
        $scope.pageSize = 10;
        $scope.data = [];
        $scope.q = '';

        $scope.getData = function () {

            return $filter('filter')( $scope.publications, $scope.q)

        };
        $scope.numberOfPages = function () {
            return Math.ceil($scope.getData().length / $scope.pageSize);
        }

    });


ArticleModel.filter('startFrom', function() {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }

    $scope.$on('LOAD',function(){$scope.loading=true});
    $scope.$on('UNLOAD',function(){$scope.loading=false});

})
ArticleModel.directive('file', function () {
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
