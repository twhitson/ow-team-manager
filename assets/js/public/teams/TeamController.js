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
            });
            
            var mbarraysr = [];
            var mbarraykda = [];
            $scope.team.teammembers.forEach(function(member) {
                if (member.rank != null && member.rank != 0) {
                    console.log(member.rank);
                    mbarraysr = mbarraysr.concat(member.rank);
                }
                if (member.averageKd != null && member.averageKd != 0) {
                    console.log(member.averageKd);
                    mbarraykda = mbarraykda.concat(member.averageKd);
                }
            });
            
            $scope.$apply(function() {
                $scope.team.avgrank = parseInt($scope.calcAverage(mbarraysr));
                $scope.team.avgkda = parseFloat($scope.calcAverage(mbarraykda));
            });
        });
    };
    
    $scope.filterBattletag = function(tag) {
        return tag.substr(0, tag.indexOf("#"));
    };
    
    $scope.filterHeroName = function(name) {
        return name.replace(':', '');
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
            toastr.error('Something bad happened. Please try again.', 'Error');
            return;
        })
        .finally(function eitherWay() {
            $scope.addmemberForm.loading = false;
        });
    };
    
    
    /* Reload Team Member */
    
    $scope.reloadTeamMember = function(id) {
        toastr.info('Pulling data from Overwatch, this might take a minute.', 'Loading...');
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
    
    $scope.calcAverage = function(value) {
        var sum = 0;
        for( var i = 0; i < value.length; i++ ){
            sum += parseInt( value[i], 10 );
        }
        
        return sum/value.length;
    };
    
}]);