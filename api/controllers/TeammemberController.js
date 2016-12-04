/* global Teammember */

/**
 * TeamMemberController
 * 
 * @description :: Server-side logic for managing team members
 */
 
var https = require('https');
var async = require('async');

module.exports = {
    
    loaddata: function(req, res) {
        var id = req.param('id');
        var calls = [];
        
        Teammember.findOne(id).exec(function(err, member) {
            if (err != null) return res.json(err);
            
            calls.push(function(callback) {
                https.get({
                    host: 'api.lootbox.eu',
                    path: '/pc/' + member.region + '/' + member.battletag.replace("#", "-") + '/profile'
                }, function(response) {
                    var body = '';
                    response.on('data', function(d) {
                        try {
                            body = JSON.parse(d);
                        }
                        catch(err) {}
                    });
                    
                    response.on('end', function() {
                        console.log(body);
                        if (typeof body === "object" && body.error == null && body.data != null && body.data.competitive != null) {
                            member.rank = body.data.competitive.rank;
                        }
                        
                        Teammember.update(member.id, member).exec(function afterwards(err, updated) {
                            if (err != null) { console.log(err); }
                            callback();
                        });
                    });
                });
            });
            
            calls.push(function(callback) {
                https.get({
                    host: 'api.lootbox.eu',
                    path: '/pc/' + member.region + '/' + member.battletag.replace("#", "-") + '/competitive/allHeroes/'
                }, function(response) {
                    var body = '';
                    response.on('data', function(d) {
                        try {
                            body = JSON.parse(d);
                        }
                        catch(err) {}
                    });
                    
                    response.on('end', function() {
                        if (typeof body === "object" && body.error == null) {
                            member.averageKd = parseFloat(parseFloat(body['Eliminations-Average']) / parseFloat(body['Deaths-Average']));
                        }
                        
                        Teammember.update(member.id, member).exec(function afterwards(err, updated) {
                            if (err != null) { console.log(err); }
                            callback();
                        });
                    });
                });
            });
            
            calls.push(function(callback) {
                https.get({
                    host: 'api.lootbox.eu',
                    path: '/pc/' + member.region + '/' + member.battletag.replace("#", "-") + '/competitive/heroes'
                }, function(response) {
                    var body = '';
                    response.on('data', function(d) {
                        try {
                            body = JSON.parse(d);
                        }
                        catch(err) {}
                    });
                    
                    response.on('end', function() {
                        if (typeof body === "object" && body.error == null) {
                            body = body.sort(function(a,b) {return (a.percentage < b.percentage) ? 1 : ((b.percentage < a.percentage) ? -1 : 0);} );
                            
                            member.mostPlayed1 = body[0].name.replace('&#xFA;', 'ú').replace('Torbjoern', 'Torbjörn').replace('Soldier76', 'Soldier: 76');
                            member.mostPlayed2 = body[1].name.replace('&#xFA;', 'ú').replace('Torbjoern', 'Torbjörn').replace('Soldier76', 'Soldier: 76');
                            member.mostPlayed3 = body[2].name.replace('&#xFA;', 'ú').replace('Torbjoern', 'Torbjörn').replace('Soldier76', 'Soldier: 76');
                        }
                        
                        Teammember.update(member.id, member).exec(function afterwards(err, updated) {
                            if (err != null) { console.log(err); }
                            callback();
                        });
                    });
                });
            });
            
            async.parallel(calls, function(err, result) {
                if (err != null) { console.log(err); }
                return res.json(member);
            });
        });
    }
};