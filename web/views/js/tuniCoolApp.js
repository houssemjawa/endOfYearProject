var TuniCoolApp = angular.module("TuniCoolApp",['ngCookies','ngRoute']);

TuniCoolApp.service('DataArticleService' ,['$http', function($http) {
     return {
         getDataArticle: function () {
             var  allArticle = []  ;
             $http.get('/pfa_alpha/web/app_dev.php/list').then(function (data) {

                 allArticle = (data.data) ;
                 return  allArticle
             });

             return allArticle;
         }
     };

}]) ;

TuniCoolApp.filter('startFrom', function() {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
    })


TuniCoolApp.controller('ArticleController' ,function ($scope,$http,DataArticleService,$cookies) {

$scope.$on('login',function(){$scope.login=true});
$scope.$on('logout',function(){$scope.login=false});

   //===================profil=============
    var profile = function(){
      $http({
        url: '/pfa_alpha/web/app_dev.php/profile',
        method: 'POST',
        data : {
        token: $cookies.get('token')
        }
    }).success(function(response){ 
      $scope.result=response;
     
    });
  };
$scope.checkConnection = function() {
if (typeof($cookies.get('token')) != 'undefined'){
 profile() ;
}


}





    var Article = DataArticleService.getDataArticle();

    var Restaurant = function () {

      $scope.$emit('LOAD');
      
        $http({
            method: 'GET',
            url: '/pfa_alpha/web/app_dev.php/list'
        }).success(function (response) {
                $scope.Restaurants = response;
                $scope.$emit('UNLOAD');
            }
        );
    };

    $scope.listRestaurant = Restaurant();

    $scope.postlistArticle = function () {
        $http({
            method: 'POST',
            url: '{Resto_Nom}/Article',
            data: {
                type: $scope.Nom,
                Adress: $scope.Adress,
                Nom: $scope.Nom
            }
        }).success(function (response) {
            $scope.name = "";
            $scope.password = "";
            listRestaurant();

        });
    };

    $scope.$on('LOAD',function(){$scope.loading=true});
    $scope.$on('UNLOAD',function(){$scope.loading=false});
})

TuniCoolApp.controller('MapCtrl', function ($scope,$http,$filter) {



        var mapOptions = {
            zoom: 6,
            center: new google.maps.LatLng(36.8403528,10.1385998),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }
        var map = new google.maps.Map(document.getElementById('map'), mapOptions);

        var markers = [];

        var infoWindow = new google.maps.InfoWindow();

       var createMarker = function (info){

            var marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(info.lat, info.long),
                title: info.name,
                cone:info.path,
                city:info.adresse,
               content:info.about

            });

            marker.content = "<img style='width=150px;width: 400px ;' src=/../../../"+ info.path + ">" + '<p class="infoWindowContent"> apropos : ' +info.about + '</p>';
            google.maps.event.addListener(marker, 'click', function(){
                infoWindow.setContent('<h2>' + marker.title + '</h2>'+ marker.content);

                infoWindow.open(map, marker);
            });
            markers.push(marker);
            $scope.markers= markers;
        }
        $scope.openInfoWindow = function(e, selectedMarker){
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        }
        $scope.Restaurant =  function(donnee)  {
            $http({
                method:'GET',
                url:'/pfa_alpha/web/app_dev.php/search/'+donnee

            }).success(function(response)
                {
                  console.log(response)
                    $scope.Restaurants = response ;
                    for (x in response) {
                        createMarker(response[x]);
                    }
                    }
            ) ;
        };
        $scope.addmarke = function() {

          //  console.log($scope.lat) ;
        }



var geocoder= new google.maps.Geocoder(); 

        function markerCoords(markerobject) {

            google.maps.event.addListener(markerobject, 'dragend', function (evt) {
                infoWindow.setOptions({
                    content: '<p> CLique sur marqueur pour enregistrer les coordonnées </p>'

                });

            });

            google.maps.event.addListener(markerobject, 'drag', function (evt) {
                console.log("marker is being dragged" + evt.latLng.lat().toFixed(3));
            });
        }

        $(document).ready(function () {
            $("#autocomplete").autocomplete({
                source: function (request, response) {
                    geocoder.geocode({'address': request.term}, function (results) {
                        response($.map(results, function (item) {
                            return {
                                label: item.formatted_address,
                                value: item.formatted_address,
                                latitude: item.geometry.location.lat(),
                                longitude: item.geometry.location.lng()
                            }

                        }))
                    })
                },

                select: function (event, ui) {
                    //var map = new google.maps.Map(document.getElementById('map'), mapOptions);
                    var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
                    var setmarker = new google.maps.Marker({
                        map: map,
                        draggable: true

                    });

                    setmarker.setPosition(location);
                    google.maps.event.addListener( setmarker, 'drag', function (evt) {

                        infoWindow.open(map,  setmarker);

                    });
                    google.maps.event.addListener (setmarker, 'click', function () {
                        var postionMarker = '<h2>' +  setmarker.getPosition().lat() + '</h2>' +  setmarker.getPosition().lng();
                        console.log( setmarker.getPosition().lat());
                        var setLat =  setmarker.getPosition().lat();
                        var setlong =  setmarker.getPosition().lng();


                    }) ;

                    map.setCenter(location);

                }


            })

        });

//===============Creation de Restaurant========

    $scope.filterMarkers = function (city) {
        console.log(city);
        for (x in markers) {
            if (markers[x].city == city || city.length === 0) {
                markers[x].setVisible(true);
            }
            // Categories don't match
            else {
                markers[x].setVisible(false);
            }
        }
    }
//==========================Pagination==========
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.data = [];
    $scope.q = '';

    $scope.getData = function () {

        return $filter('filter')( $scope.markers, $scope.q)

    };
    $scope.numberOfPages = function () {
        return Math.ceil($scope.getData().length / $scope.pageSize);
    }



});


TuniCoolApp.controller('RestaurantController',  function ($scope, $filter,$http, $routeParams , $cookies) {



$scope.getUser = function () 
{
  $http({
    url : '/pfa_alpha/web/app_dev.php/Client/'+$cookies.get('id') ,
    method : 'GET'
    }).success(function(response){
        console.log(response)
      $scope.user = response
})
}
$scope.like = function(id_etablissement){
  $http({
    url : '/pfa_alpha/web/app_dev.php/'+id_etablissement+'/like/'+$cookies.get('id'),
    method : 'POST'
  }).success(function(response){
    console.log('stest');
  }).error(function(response){
  });
};

$scope.follow = function (id_etablissement)
{
$http({
    url : '/pfa_alpha/web/app_dev.php/'+id_etablissement+'/follow/'+$cookies.get('id'),
    method : 'GET'
  }).success(function(response){
    console.log('ok') ;
      return false;
  }).error(function(response){  
    console.log('non') ;
return true;

  });
};






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
              console.log(response[0]) ;
             

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
             console.log('ici2') ;

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
            console.log('ici1') ;
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
            console.log(id_article)
            $http({
                method: 'POST',
                url: '/pfa_alpha/web/app_dev.php/' + id_article + '/publication',
                data: {
                   content: $scope.content
                }
            }).success(function () {

                $scope.content = "";
                Listpublication();

            })
                .error(function (response) {
                    window.location = "#/404";
                })

        };

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
                url: '/pfa_alpha/web/app_dev.php/' + idPublication + '/Commentaire/'+$cookies.get('id'),
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



TuniCoolApp.controller("registerCtrl",function($scope,$http,$cookieStore,$cookies){

  $scope.$on('LOAD',function(){$scope.loading=true});
  $scope.$on('UNLOAD',function(){$scope.loading=false});

$scope.logout = function(){
  $http({
    url: '/pfa_alpha/web/app_dev.php/disconnect/'+$cookies.get('token'),
    method: 'DELETE',
}).success(function(response){
  console.log(response);
  $cookies.remove('token');
  $cookies.remove('id');
  window.location = '#/home'
});
};
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
        window.location = '#/login' ;
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
var profile = function(){

      $http({
        url: '/pfa_alpha/web/app_dev.php/profile',
        method: 'POST',
        data : {
        token: $cookies.get('token')
        }
    }).success(function(response){ 
      $scope.result=response;

      $cookies.put('id',response.id);
    });
  };
  $scope.profile = profile()   ;
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
    url: '/pfa_alpha/web/app_dev.php/disconnect/'+$cookies.get('token'),
    method: 'DELETE',
}).success(function(response){
  console.log(response);
  $cookies.remove('token');
   $cookies.remove('id');
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

/********************************************************************************/

/********************************************************************************/
});






///============SuperRoute======//

TuniCoolApp.controller("ACtrl", function($routeParams,$scope,$http,$cookieStore,$cookies){

var publica = function (NomArticle,num_publicat) {
     console.log('ici3') ;
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
                url: '/pfa_alpha/web/app_dev.php/' + idPublication + '/Commentaire/' +  $cookies.get('id'),
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





   var DeletePub = function (Nom_Article, Publication_id) {
            $http({
                method: 'DELETE',
                url: '/pfa_alpha/web/app_dev.php/' + Nom_Article + '/publication/' + Publication_id
            }).success(function () {
               pub1($routeParams.NomArticle);
            })

        };


        $scope.DeletePublication = function (Publication_id) {
            DeletePub($routeParams.NomArticle, Publication_id);
        }

        var EtidierPublication = function(Nom_Article,id_publication) {
            $http({

                method: 'PUT',
                url: '/pfa_alpha/web/app_dev.php/'+ Nom_Article + '/publication/' + id_publication,
                data: {
                    content: $scope.publication1
                }
            }).success(function () {

                $scope.content = " ";
                window.location = "#/admin/article/"+ Nom_Article;
                
                //$scope.Listpublication(id_publication) ;
                

            })
        }

        $scope.EtidierPublication = function()
        {

            EtidierPublication($routeParams.NomArticlep,$routeParams.publication_id) ;
        }
//========================getlistPublication==========================

var pub1 = function (NomArticle) {
    console.log(NomArticle) ;
            $scope.$emit('LOAD');
            $http.get('/pfa_alpha/web/app_dev.php/' + NomArticle + '/publications').success(function (response) {

                $scope.$emit('UNLOAD');
                window.location = "#/admin/article/"+ NomArticle;
                $scope.publications = response;
                $scope.NomArticle = NomArticle;

                $scope.imageArticle = response[0].path ;
               

            })
                .error(function () {
                    window.location = "#/PublicationNotFound";

                })
        };
        
        $scope.pub = function (NomArticle) {
             console.log(NomArticle) ;
    
            $scope.$emit('LOAD');
            $http.get('/pfa_alpha/web/app_dev.php/' + NomArticle + '/publications').success(function (response) {

                $scope.$emit('UNLOAD');
                window.location = "#/admin/article/"+ NomArticle;
                $scope.publications = response;
                $scope.NomArticle = NomArticle;
                $scope.ImageArticle = response[0].image;

            })
                .error(function () {
                    window.location = "#/PublicationNotFound";


                })

        };

          $scope.postPublication = function (id_article) {
            console.log(id_article)
            $http({
                method: 'POST',
                url: '/pfa_alpha/web/app_dev.php/' + id_article + '/publication',
                data: {
                    content: $scope.publca
                }
            }).success(function () {

                $scope.publca = "";
               pub1($routeParams.NomArticle);

            })
                .error(function (response) {
                    window.location = "#/404";
                })

        };


     $scope.Listpublication = function (){
        pub1($routeParams.NomArticle)  ;
    }
//=============/

$scope.checklogin = function() {
if(typeof($cookies.get('token')) == 'undefined') {
  window.location='#/login';
}}




//========================getlistArticle==========================
$scope.ListArticles1 = function () {

    $http({
        method: 'GET',
        url: '/pfa_alpha/web/app_dev.php/Article/'+ $cookies.get('id'),
    }).success(function (response) {
    
        $scope.Articles1 = response;
        data = angular.copy(response);
        console.log(response)
        var image = [];
        for (x in response) image.push(response[x].path);

})
        .error(function () {
            window.location = "#/404";
        })

};




//============================================================================================



var profile = function(){

      $http({
        url: '/pfa_alpha/web/app_dev.php/profile',
        method: 'POST',
        data : {
        token: $cookies.get('token')
        }
    }).success(function(response){ 
      $scope.result=response;
    });
  };
  $scope.profile = profile()   ;


//============================================================================================


  $scope.addArticle = function(){

    $http({
            method: 'POST',
            url: '/pfa_alpha/web/app_dev.php/Article/'+$cookies.get('id') ,
            headers: {
                'Content-Type': undefined
            },
            data: {
                nom : $scope.nom,
                prix : $scope.prix,
                type : $scope.type,
                file : $scope.file,
    token: $cookies.get('token')
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
        .success(function (response) {
      window.location =".#/description" ;
     $scope.nom="";
    $scope.prix="";
      $scope.type="";
      
        })
        .error(function (data, status) {

          $scope.nom="";
       $scope.prix="";
         $scope.type="";
        });
}

})
TuniCoolApp.controller("AdminCtrl", function($scope,$http,$cookieStore){


  $scope.addPage = function(){

    $http({
            method: 'POST',
            url: '/pfa_alpha/web/app_dev.php/register/page',
            headers: {
                'Content-Type': undefined
            },
            data: {
                name : $scope.name,
                categorie : $scope.categorie,
                adresse : $scope.adresse,
                admin : $scope.admin,
                file : $scope.file,
                lat :  $scope.lat ,
                lg : $scope.lg,
                about: $scope.about


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
        .success(function () {
window.location = '#/success' ;
$scope.name="";
 $scope.categorie="";
$scope.adresse="";
$scope.admin="";
$scope.lat="" ;
$scope.lg="";
$scope.about="";
        })
        .error(function (data, status) {

          window.location = '#/Error'
          $scope.name="";
           $scope.categorie="";
          $scope.adresse="";
           $scope.admin="";
          $scope.lat="" ;
          $scope.lg="";
          $scope.about="";
        });
};
 












/***************************************************************************/ 
  var getLislogablissements = function(){
    $http({
      url : '/pfa_alpha/web/app_dev.php/list',
      method: 'GET'
    }).success(function(response){
      $scope.result = response;
     
    }).catch();
};





$scope.result= getLislogablissements();
/****************************************************************************/
$scope.delete = function(id){

         $http({
           url : '/page/'+id,
           method : 'DELETE'
         }).success(function(response){
           getLislogablissements();
         });
  };
// =========================================Map=======================

var checkConnection = function () {

return token = $cookies.get('token') ; 
}

var mapOptions = {
      zoom: 6,
      center: new google.maps.LatLng(36.8403528,10.1385998),
      mapTypeId: google.maps.MapTypeId.TERRAIN
  }
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

  var markers = [];
  var infoWindow = new google.maps.InfoWindow();

    var createMarker = function (info){

        var marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.name,
            cone:info.path,
            city:info.city


        });

        marker.content = "<img width='150' src=" + info.path + ">" + '<p class="infoWindowContent"> adress : ' +info.city + '</p>';

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>'+ marker.content);

            infoWindow.open(map, marker);
        });
        markers.push(marker);
        $scope.markers= markers;
    }
    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }
    $scope.Restaurant =  function()  {
        $http({
            method:'GET',
            url:'/pfa_alpha/web/app_dev.php/list'
        }).success(function(response)
            {
                $scope.Restaurants = response ;
                for (x in response) {
                    createMarker(response[x]);

                }
            }
        ) ;
    };
    $scope.addmarke = function() {

        //  console.log($scope.lat) ;
    }

var geocoder= new google.maps.Geocoder();

    function markerCoords(markerobject) {

        google.maps.event.addListener(markerobject, 'dragend', function (evt) {
            infoWindow.setOptions({
                content: '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>'

            });

        });

        google.maps.event.addListener(markerobject, 'drag', function (evt) {
            console.log("marker is being dragged" + evt.latLng.lat().toFixed(3));
        });
    }

    $(document).ready(function () {
        $("#autocomplete").autocomplete({
            source: function (request, response) {
                geocoder.geocode({'address': request.term}, function (results) {
                    response($.map(results, function (item) {
                        return {
                            label: item.formatted_address,
                            value: item.formatted_address,
                            latitude: item.geometry.location.lat(),
                            longitude: item.geometry.location.lng()
                        }

                    }))
                })
            },

            select: function (event, ui) {
                //var map = new google.maps.Map(document.getElementById('map'), mapOptions);
                var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
                var setmarker = new google.maps.Marker({
                    map: map,
                    draggable: true

                });

                setmarker.setPosition(location);
                google.maps.event.addListener( setmarker, 'drag', function (evt) {
                    setmarker.content = '<div class="infoWindowContent">' +  setmarker.getPosition().lat() + '</div>';
                    infoWindow.setContent('<h2> CLique sur marqueur pour enregistrer les coordonnées </h2>');
                    infoWindow.open(map,  setmarker);

                });
                google.maps.event.addListener (setmarker, 'click', function () {
                    var postionMarker = '<h2> les coordonnées eest bien enregistrée </h2>';
                    infoWindow.setContent(postionMarker);
                    infoWindow.open(map,  setmarker);
       
                    $scope.lat =  setmarker.getPosition().lat();
                    $scope.lg=  setmarker.getPosition().lng();
                   




                }) ;

                map.setCenter(location);

            }


        })

    });

//===============Creation de Restaurant========

    $scope.filterMarkers = function (city) {
        console.log(city);
        for (x in markers) {
            if (markers[x].city == city || city.length === 0) {
                markers[x].setVisible(true);
            }
            // Categories don't match
            else {
                markers[x].setVisible(false);
            }
        }
    }
//==========================Pagination==========
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.data = [];
    $scope.q = '';

    $scope.getData = function () {

        return $filter('filter')( $scope.markers, $scope.q)

    };
    $scope.numberOfPages = function () {
        return Math.ceil($scope.getData().length / $scope.pageSize);
    }







});





TuniCoolApp.directive('file', function () {
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












TuniCoolApp.filter('startFrom', function() {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }

    $scope.$on('LOAD',function(){$scope.loading=true});
    $scope.$on('UNLOAD',function(){$scope.loading=false});

})





