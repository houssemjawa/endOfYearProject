
TuniCoolApp.controller('ArticleController' ,function ($scope,$http,DataArticleService) {

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

