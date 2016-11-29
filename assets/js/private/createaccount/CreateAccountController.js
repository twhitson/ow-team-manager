/* global angular */

angular.module('CreateAccountModule').controller('CreateAccountController', ['$scope', '$http', 'toastr', function($scope, $http, toastr) {
    
    $scope.createaccountForm = {
        loading: false
    };
    
    $scope.submitCreateAccountForm = function() {
        $scope.createaccountForm.loading = true;
        
        $http.post('/user/createaccount', {
            name: $scope.createaccountForm.name,
            email: $scope.createaccountForm.email,
            password: $scope.createaccountForm.password
        })
        .then(function onSuccess(){
            toastr.success('Account has been created.', 'Success');
            $scope.createaccountForm.name = '';
            $scope.createaccountForm.email = '';
            $scope.createaccountForm.password = '';
        })
        .catch(function onError(sailsResponse) {
            if (sailsResponse.status === 409) {
                toastr.error(sailsResponse.data, 'Error');
                return;
            }
        })
        .finally(function eitherWay() {
            $scope.createaccountForm.loading = false;
        });
    };
}]);