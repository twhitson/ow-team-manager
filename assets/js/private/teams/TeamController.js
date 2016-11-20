/* global angular io */

angular.module('TeamModule').controller('TeamController', ['$scope', '$http', 'toastr', function ($scope, $http, toastr) {
    
    /* List Teams */

    $scope.loadTeams = function() {
        io.socket.request({
            method: 'get',
            url: '/team/find',
            data: {
                limit: 50
            }
        }, function (resData, jwres) {
            $scope.$apply(function() {
                $scope.teams = resData;
            });
        });
    };
    
    io.socket.on('team', function (message) {
        console.log(JSON.parse(JSON.stringify(message)));
        
        if (message.verb === 'created') {
            $scope.$apply(function() {
                $scope.teams = $scope.teams.concat(message.data);
            });
        }
        else {
            $scope.loadTeams();
        }
    });
    
    
    /* Create Team */
    
    $scope.createteamForm = {
        loading: false
    };
    
    $scope.submitCreateTeamForm = function() {
        $scope.createteamForm.loading = true;
        
        $http.post('/team/create', {
            name: $scope.createteamForm.name
        })
        .then(function onSuccess(sailsResponse){
            window.location = '/team/' + sailsResponse.teamId;
        })
        .catch(function onError(sailsResponse) {
            if (sailsResponse.status === 409) {
                toastr.error(sailsResponse.data, 'Error');
                return;
            }
        })
        .finally(function eitherWay() {
            $scope.createteamForm.loading = false;
        });
    };
    
    
    /* Add Team Member */
    
    $scope.addmemberForm = {
        loading: false
    };
    
    $scope.submitAddMemberForm = function() {
        $scope.addmemberForm.loading = true;
        
        $http.post('/team/addmember', {
            battletag: $scope.addmemberForm.battletag,
            teamId: $scope.addmemberForm.teamId
        })
        .then(function onSuccess() {
            toastr.success('Player added to team!', 'Success')
            $scope.addmemberForm.battletag = "";
            return;
        })
        .catch(function onError() {
            toastr.error('Something bad happened. Please try again.', 'Error');
            return;
        })
        .finally(function eitherWay() {
            $scope.addmemberForm.loading = false;
        });
    };
    
}]);