var adminApp = angular.module("adminApp",['ngRoute','ngCookies']);

adminApp.config(['$routeProvider',function($routeProvider) {

    $routeProvider
        .when('/success',{
            templateUrl: '/pfa_alpha/web/views/404/done.html',
            controller : 'AdminCtrl'

        })
        .when('/etablissment',{
            templateUrl: '/pfa_alpha/web/views/admin/views/addPage1.html',
            controller : 'AdminCtrl'

        })
        .when('/description',{
            templateUrl: '/pfa_alpha/web/views/admin/views/listArticle.html',
            controller : 'AdminCtrl'
        })
        .when('/description/:NomArticle',{
            templateUrl: '/pfa_alpha/web/views/admin/views/listArticle.html',
            controller : 'AdminCtrl'

        })
        .when('/aide',{
            templateUrl: '/pfa_alpha/web/views/admin/views/aide.html',
            controller : 'AdminCtrl'

        })
        .when('/articles',{
            templateUrl: '/pfa_alpha/web/views/admin/views/addArticle.html',
            controller : 'ACtrl'
        })
        .when('/article/:NomArticle',{
            templateUrl: '/pfa_alpha/web/views/admin/views/addPublication.html',
            controller : 'ACtrl'
        })


        .when('/Error', {
            templateUrl: '/pfa_alpha/web/views/404/404.html',
            controller: 'ACtrl'
        })
        .when('/500', {
            templateUrl: '/pfa_alpha/web/views/404/404.html',
            controller: 'ArticleController'
        }) .otherwise({
        redirectTo: '/home' ,
            controller: 'ACtrl'
    }) ;
}]) ;



/*******************Articl**********/

adminApp.controller("ACtrl", function($scope,$http,$cookieStore){

//========================getlistPublication==========================
var publica = function (NomArticle,num_publicat) {
    $http.get('/pfa_alpha/web/app_dev.php/' + NomArticle + '/publications').success(function (response) {
        window.location = '#/description' + NomArticle;
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
        })

};
$scope.Listpublication = function (num_publicat) {
    publica($routeParams.NomArticle,num_publicat);
};



//========================getlistArticle==========================
var Article = function (nomResto) {
  console.log('ok') ;
console.log(nomResto) ;
    $http({
        method: 'GET',
        url: '/pfa_alpha/web/app_dev.php/La collete/Articles'
    }).success(function (response) {
console.log($scope.Articles) ;
        $scope.Articles = response;
        data = angular.copy(response);
        var image = [];
        for (x in response) image.push(response[x].path);

})
        .error(function () {
            window.location = "#/404";
        })

};
$scope.ListArticle = function () {
  
    Article('test');

};




//============================================================================================



  $scope.profile = function(){

      $http({
        url: '/pfa_alpha/web/app_dev.php/profile',
        method: 'POST',
        data : {
          token:$cookieStore.get('token')
        }
    }).success(function(response){
      $scope.result=response;
        console.log($cookieStore.get('token'))
    });
  };

  $scope.addArticle = function(){
  console.log($cookieStore.get('token')) ;
    $http({
            method: 'POST',
            url: '/pfa_alpha/web/app_dev.php/Article',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: {
                nom : $scope.nom,
                prix : $scope.prix,
                type : $scope.type,
                file : $scope.file,
    token: $cookieStore.get('token')
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
          console.log($cookieStore.get('token')) ;
       $scope.nom="";
    $scope.prix="";
      $scope.type="";
        })
        .error(function (data, status) {
  console.log($cookieStore.get('token')) ;
          $scope.nom="";
       $scope.prix="";
         $scope.type="";
        });
}

})
adminApp.controller("AdminCtrl", function($scope,$http,$cookieStore){



  $scope.addPage = function(){

    $http({
            method: 'POST',
            url: '/pfa_alpha/web/app_dev.php/register/page',
            headers: {
                'Content-Type': 'multipart/form-data'
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
  var getListEtablissements = function(){
    $http({
      url : '/pfa_alpha/web/app_dev.php/list',
      method: 'GET'
    }).success(function(response){
      $scope.result = response;
      console.log($scope.result);
    }).catch();
};





$scope.result= getListEtablissements();
/****************************************************************************/
$scope.delete = function(id){

         $http({
           url : '/page/'+id,
           method : 'DELETE'
         }).success(function(response){
           getListEtablissements();
         });
  };
// =========================================Map=======================


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
                    infoWindow.setContent('<h2>' + evt.latLng.lat().toFixed(3) + '</h2>' + evt.latLng.lat().toFixed(3));
                    infoWindow.open(map,  setmarker);

                });
                google.maps.event.addListener (setmarker, 'click', function () {
                    var postionMarker = '<h2>' +  setmarker.getPosition().lat() + '</h2>' +  setmarker.getPosition().lng();
                    console.log( setmarker.getPosition().lat());
                    $scope.lat =  setmarker.getPosition().lat();
                    $scope.lg=  setmarker.getPosition().lng();
                    console.log($scope.lat) ;
                    console.log($scope.lg) ;




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
adminApp.directive('file', function () {
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
