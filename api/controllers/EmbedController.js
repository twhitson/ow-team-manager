
/**
 * PublicController
 * 
 * @description :: Server-side logic for embed pages
 */
 
module.exports = {
    team: function(req, res) {
        return res.view('embed/team', {id:req.param('id'), layout: 'layouts/embed'});
    }
};