/* global Team */

/**
 * TeamController
 * 
 * @description :: Server-side logic for managing teams
 */
 
var request = require('request');
var cheerio = require('cheerio');
 
module.exports = {
    
    index: function(req, res) {
        return res.view('private/teams', {layout: 'layouts/private'});
    },
    
    view: function(req, res) {
        return res.view('private/team', {layout: 'layouts/private', id: req.param('id')});
    },
    
    loaddata: function(req, res) {
        var id = req.param('id');
        
        Team.findOne(id).exec(function(err, team) {
            if (err != null) {
                return res.json({error: "Invalid team ID."});
            } else {
                request('http://www.gosugamers.net/overwatch/teams/' + team.gosuUrl, function(error, response, html) {
                    if (!error) {
                        try {
                            var $ = cheerio.load(html);
                        

                            $('.rankings').filter(function() {
                                var data = $(this);
                                
                                team.gosuInt = data.children().last().children().first().text();
                                
                                var data2 = data.children().last().prev().children();
                                
                                if (data2.last().children().first().text() === "North America") {
                                    team.gosuNa = data2.first().text();
                                }
                                if (data2.last().children().first().text() === "Europe") {
                                    team.gosuEu = data2.first().text();
                                }
                                
                                Team.update(team.id, team).exec(function afterwards(err, updated) {
                                    if (err != null) { console.log(err); }
                                    return res.json(updated);
                                });
                            });
                        }
                        catch(err) {
                            return res.json({});
                        }
                    } else {
                        console.log(error);
                        return res.json({});
                    }
                });
            }
        });
    }
    
};