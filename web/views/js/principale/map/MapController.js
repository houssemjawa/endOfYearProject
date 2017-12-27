var mapsApp = angular.module('mapsApp', ['ngRoute']) ;
mapsApp.controller('MapCtrl', function ($scope,$http,$filter) {



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
mapsApp.filter('startFrom', function() {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
    })
