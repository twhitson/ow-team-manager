
/**
 * PublicController
 * 
 * @description :: Server-side logic for public pages
 */
 
module.exports = {
    index: function(req, res) {
        return res.view('public/login');
    },
    
    teams: function(req, res) {
        return res.view('public/teams');
    },
    
    team: function(req, res) {
        return res.view('public/team', {id:req.param('id')});
    }
};