var app = angular.module("registerApp",[]);
app.controller("registerCtrl",function($scope,$http){
    $scope.register = function(){
        $http({
            url:'/register',
            method:'POST',
            data:{
                username:$scope.username,
                email:$scope.email,
                password:$scope.password,
                adresse : $scope.adresse,
                prenom : $scope.prenom,
                nom : $scope.nom,
                phone : $scope.phone
            }
        }).success(function(response){
            console.log('ok');
        });


    };
});
