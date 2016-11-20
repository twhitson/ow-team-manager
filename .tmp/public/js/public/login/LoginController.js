/* global angular */

angular.module('LoginModule').controller('LoginController', ['$scope', '$http', 'toastr', function ($scope, $http, toastr) {
    
    $scope.loginForm = {
        loading: false
    };
    
    $scope.submitLoginForm = function() {
        $scope.loginForm.loading = true;
        
        $http.put('/login', {
            email: $scope.loginForm.email,
            password: $scope.loginForm.password
        })
        .then(function onSuccess() {
            toastr.success('Redirecting to the dashboard!', 'Success');
            
            window.location = '/dashboard';
        })
        .catch(function onError(sailsResponse) {
            if (sailsResponse.status === 400 || sailsResponse.status === 404) {
                toastr.error('Incorrect email and password!', 'Error');
                return;
            }
        })
        .finally(function eitherWay() {
            $scope.loginForm.loading = false;
        });
    }
    
}])