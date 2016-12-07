/* global Teammember */

/**
 * TeamMemberController
 * 
 * @description :: Server-side logic for managing team members
 */

var request = require('request');
var cheerio = require('cheerio');

module.exports = {
    
    loaddata: function(req, res) {
        var id = req.param('id');
        var calls = [];
        
        Teammember.findOne(id).exec(function(err, member) {
            if (err != null) return res.json(err);
            
            request('https://playoverwatch.com/en-us/career/pc/' + member.region + '/' + member.battletag.replace('#', '-'), function(error, response, html) {
                if (!error && response.statusCode === 200) {
                    try {
                        var $ = cheerio.load(html);
                        
                        $('.competitive-rank').filter(function() {
                            var data = $(this);
                            
                            member.rank = data.children().last().text();
                        });
                        
                        $('#competitive').filter(function() {
                            var data = $(this);
                            
                            var eliminations = parseFloat(data.children().first().children().first().children().last().children().first().children().first().children().last().children().first().text());
                            var deaths = parseFloat(data.children().first().children().first().children().last().children().first().next().next().children().first().children().last().children().first().text());
                            
                            member.averageKd = parseFloat(eliminations / deaths);
                        });
                        
                        $('#competitive *[data-category-id="overwatch.guid.0x0860000000000021"]').filter(function() {
                            var data = $(this);
                            
                            member.mostPlayed1 = data.children().first().children().last().children().last().children().first().text();
                            member.mostPlayed2 = data.children().first().next().children().last().children().last().children().first().text();
                            member.mostPlayed3 = data.children().first().next().next().children().last().children().last().children().first().text();
                        });
                        
                        Teammember.update(member.id, member).exec(function afterwards(err, updated) {
                            if (err != null) { console.log(err); }
                            return res.json({"status": "SUCCESS"});
                        });
                    }
                    catch(err) {
                        return res.json({"status": "FAILURE"});
                    }
                } else {
                    console.log(error);
                    return res.json({"status": "FAILURE"});
                }
            });
        });
    }
};