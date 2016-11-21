var LRU = require('lru-cache');
var cache = LRU({max: 500, maxAge: 1000*60*60*24});

module.exports = {
    
    profile: function(req, res) {
        var platform = req.param('platform');
        var region = req.param('region');
        var tag = req.param('tag');
        
        var cached = cache.get('profile:' + platform + ':' + region + ':' + tag);
        
        if (cached != null) {
            return res.json(JSON.parse(cached));
        }
        
        
        var https = require('https');
        
        https.get({
            host: 'api.lootbox.eu',
            path: '/' + platform + '/' + region + '/' + tag + '/profile'
        }, function(response) {
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                cache.set('profile:' + platform + ':' + region + ':' + tag, JSON.stringify(JSON.parse(body).data));

                return res.json(JSON.parse(body).data);
            });
        });
    },
    
    heroes: function(req, res) {
        var platform = req.param('platform');
        var region = req.param('region');
        var tag = req.param('tag');
        var mode = req.param('mode');
        
        var cached = cache.get('heroes:' + platform + ':' + region + ':' + tag + ':' + mode);
        
        if (cached != null) {
            return res.json(JSON.parse(cached));
        }
        
        
        var https = require('https');
        
        https.get({
            host: 'api.lootbox.eu',
            path: '/' + platform + '/' + region + '/' + tag + '/' + mode + '/heroes'
        }, function(response) {
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                cache.set('heroes:' + platform + ':' + region + ':' + tag + ':' + mode, JSON.stringify(JSON.parse(body)));

                return res.json(JSON.parse(body));
            });
        });
    },
    
    allheroes: function(req, res) {
        var platform = req.param('platform');
        var region = req.param('region');
        var tag = req.param('tag');
        var mode = req.param('mode');

        var cached = cache.get('allheroes:' + platform + ':' + region + ':' + tag + ':' + mode);
        
        if (cached != null) {
            return res.json(JSON.parse(cached));
        }
        
        
        var https = require('https');
        
        https.get({
            host: 'api.lootbox.eu',
            path: '/' + platform + '/' + region + '/' + tag + '/' + mode + '/allHeroes/'
        }, function(response) {
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                cache.set('allheroes:' + platform + ':' + region + ':' + tag + ':' + mode, JSON.stringify(JSON.parse(body)));

                return res.json(JSON.parse(body));
            });
        });
    }
    
};