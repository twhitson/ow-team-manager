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
        .then(function onSuccess(sailsResponse) {
            window.location = '/team/view/' + sailsResponse.data.id;
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
    
    
    /* View Team */
    
    $scope.loadTeam = function(id) {
        io.socket.request({
            method: 'get',
            url: '/team/find/' + id,
            data: {
                limit: 50
            }
        }, function (resData, jwres) {
            $scope.$apply(function() {
                $scope.team = resData;
                
                $scope.team.teammembers.forEach(function (element) {
                    $http.get('https://api.lootbox.eu/pc/' + element.region + '/' + element.battletag.replace('#', '-') + '/profile')
                    .then(function(response) {
                        element.profile = response.data.data;
                    });
                    
                    $http.get('https://api.lootbox.eu/pc/' + element.region + '/' + element.battletag.replace('#', '-') + '/competitive/heroes')
                    .then(function(response) {
                        element.heroes = response.data;
                        element.heroes.forEach(function(hero) {
                            hero.name = hero.name.replace('&#xFA;', 'ú').replace('Torbjoern', 'Torbjörn').replace('Soldier76', 'Soldier: 76');
                        });
                    });
                    
                    $http.get('https://api.lootbox.eu/pc/' + element.region + '/' + element.battletag.replace('#', '-') + '/competitive/allHeroes/')
                    .then(function(response) {
                        element.allheroes = response.data;
                    });
                });
            });
        });
    };
    
    io.socket.on('team', function (message) {
        $scope.loadTeam($scope.team.id);
    });
    
    
    /* Add Team Member */
    
    $scope.addmemberForm = {
        loading: false
    };
    
    $scope.submitAddMemberForm = function() {
        $scope.addmemberForm.loading = true;
        
        $http.post('/teammember/create', {
            battletag: $scope.addmemberForm.battletag,
            region: $scope.addmemberForm.region,
            team: $scope.team.id
        })
        .then(function onSuccess() {
            toastr.success('Player added to team!', 'Success');
            $scope.addmemberForm.battletag = "";
            return;
        })
        .catch(function onError(sailsResponse) {
            console.log(JSON.stringify(sailsResponse.data));
            toastr.error('Something bad happened. Please try again.', 'Error');
            return;
        })
        .finally(function eitherWay() {
            $scope.addmemberForm.loading = false;
        });
    };
    
    
    /* Delete Team */
    
    $scope.deleteTeam = function(id) {
        $http.delete('/team/destroy/' + id)
        .then(function onSuccess() {
            toastr.success('Team deleted.', 'Success');
            window.location = '/team';
            return;
        })
        .catch(function onError(sailsResponse) {
            toastr.error(sailsResponse.data, 'Error');
            return;
        });
    };
    
    
    /* Delete Team Member */
    
    $scope.deleteTeamMember = function(id) {
        $http.delete('/teammember/destroy/' + id)
        .then(function onSuccess() {
            toastr.success('Team member removed.', 'Success');
            return;
        })
        .catch(function onError(sailsResponse) {
            toastr.error(sailsResponse.data, 'Error');
            return;
        });
    };
    
    
    
    
    /* Helpers */
    
    $scope.parseFloat = function(value) {
        return parseFloat(value);
    };
    
}]);