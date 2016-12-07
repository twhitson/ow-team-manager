/* global angular io */

angular.module('TeamModule').controller('TeamController', ['$scope', '$http', 'toastr', '$timeout', function ($scope, $http, toastr, $timeout) {
    
    /* List Teams */

    $scope.loadTeams = function() {
        $http.get('/team/find?limit=100')
        .then(function onSuccess(response) {
            $timeout(function() {
                $scope.$apply(function() {
                    $scope.teams = response.data;
                });
            });
        });
    };
    
    
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
        $http.get('/team/find/' + id)
        .then(function onSuccess(response) {
            $timeout(function() {
                $scope.$apply(function() {
                    $scope.team = response.data;
                });
            
                var mbarraysr = [];
                var mbarraykda = [];
                $scope.team.teammembers.forEach(function(member) {
                    if (member.rank != null && member.rank != 0) {
                        mbarraysr = mbarraysr.concat(member.rank);
                    }
                    if (member.averageKd != null && member.averageKd != 0) {
                        mbarraykda = mbarraykda.concat(member.averageKd);
                    }
                });
                
                var newAverageRank = parseInt($scope.calcAverage(mbarraysr));
                var newAverageKd = parseFloat($scope.calcAverage(mbarraykda));
                
                if (newAverageRank > 0 && newAverageKd > 0) {
                    if ($scope.team.averageRank != newAverageRank || $scope.team.averageKd != newAverageKd) {
                        $http.post('/team/update/' + $scope.team.id, {
                            averageRank: newAverageRank,
                            averageKd: newAverageKd
                        });
                    }
                }
            });
            return;
        }, function onError(response) {
            toastr.error('Could not load the team. Try again.', 'Error');
            return;
        });
    };
    
    $scope.filterBattletag = function(tag) {
        return tag.substr(0, tag.indexOf("#"));
    };
    
    $scope.filterHeroName = function(name) {
        return name.replace(':', '');
    };
    
    
    /* Reload Team */
    
    $scope.loadGosu = function(id) {
        toastr.info('Pulling data from Gosu.', 'Loading...');
        $http.post('/team/loaddata/' + id)
        .then(function onSuccess() {
            toastr.success('Gosu data loaded.', 'Success');
            $scope.loadTeam($scope.team.id);
            return;
        })
        .catch(function onError(sailsResponse) {
            toastr.error('Something went wrong. Try again', 'Error');
            return;
        });
    };
    
    
    /* Update Team Data */
    
    $scope.updateTeamData = function() {
        $http.post('/team/update/' + $scope.team.id, {
            name: $scope.team.name,
            imageUrl: $scope.team.imageUrl
        })
        .then(function onSuccess() {
            toastr.success('Team data updated.', 'Success');
            $scope.loadTeam($scope.team.id);
            return;
        })
        .catch(function onError(sailsResponse) {
            toastr.error('Something went wrong. Try again.', 'Error');
            return;
        });
    };
    
    $scope.updateGosuUrl = function() {
        $http.post('/team/update/' + $scope.team.id, {
            gosuUrl: $scope.team.gosuUrl
        })
        .then(function onSuccess() {
            toastr.success('Gosu URL updated.', 'Success');
            $scope.loadTeam($scope.team.id);
            return;
        })
        .catch(function onError(sailsResponse) {
            toastr.error('Something went wrong. Try again.', 'Error');
            return;
        });
    };
    
    $scope.updateTeamGosu = function() {
        $http.post('/team/update/' + $scope.team.id, {
            gosuInt: $scope.team.gosuInt,
            gosuEu: $scope.team.gosuEu,
            gosuNa: $scope.team.gosuNa,
        })
        .then(function onSuccess() {
            toastr.success('Gosu data updated.', 'Success');
            $scope.loadTeam($scope.team.id);
            return;
        })
        .catch(function onError(sailsResponse) {
            toastr.error('Something went wrong. Try again.', 'Error');
            return;
        });
    };
    
    
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
            $scope.loadTeam($scope.team.id);
            $scope.addmemberForm.battletag = "";
            return;
        })
        .catch(function onError(sailsResponse) {
            toastr.error('Something bad happened. Please try again.', 'Error');
            return;
        })
        .finally(function eitherWay() {
            $scope.addmemberForm.loading = false;
        });
    };
    
    
    /* Reload Team Member */
    
    $scope.reloadAllTeamMembers = function() {
        $scope.team.teammembers.forEach(function(member) {
            $scope.reloadTeamMember(member.id);
        });
    };
    
    $scope.reloadTeamMember = function(id) {
        toastr.info('Pulling data from Overwatch.', 'Loading...');
        $http.post('/teammember/loaddata/' + id)
        .then(function onSuccess() {
            toastr.success('Data loaded.', 'Success');
            $scope.loadTeam($scope.team.id);
            return;
        })
        .catch(function onError(sailsResponse) {
            toastr.error(sailsResponse.data, 'Error');
            return;
        });
    };
    
    
    /* Update Team Member */
    
    $scope.updateMemberRank = function(id, rank) {
        $http.post('/teammember/update/' + id, {
            rank: rank
        })
        .then(function onSuccess() {
            toastr.success('Rank updated.', 'Success');
            $scope.loadTeam($scope.team.id);
            return;
        })
        .catch(function onError(sailsResponse) {
            toastr.error('Something went wrong. Try again.', 'Error');
            return;
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
            $scope.loadTeam($scope.team.id);
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
    
    $scope.calcAverage = function(value) {
        var sum = 0;
        for( var i = 0; i < value.length; i++ ){
            sum += parseInt( value[i], 10 );
        }
        
        return sum/value.length;
    };
    
}]);