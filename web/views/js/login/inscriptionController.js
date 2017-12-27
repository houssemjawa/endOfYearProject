var app = angular.module("registerApp",['ngRoute','ngAnimate']);
app.controller("registerCtrl",function($scope,$http){
  $scope.register = function(){
    $http({
            method: 'POST',
            url: '/pfa_alpha/web/app_dev.php/register',
            headers: {
                'Content-Type': 'multipart/form-data'
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
            console.log(data);
        })
        .error(function (data, status) {
          console.log(data);
        });
  };

});
app.directive('file', function () {
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
