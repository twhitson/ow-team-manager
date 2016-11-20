/* global Team */

/**
 * TeamController
 * 
 * @description :: Server-side logic for managing teams
 */
 
module.exports = {
    
    index: function(req, res) {
        return res.view('private/teams', {layout: 'layouts/private'});
    },
    
    view: function(req, res) {
        return res.view('private/team', {layout: 'layouts/private'});
    }
    
};