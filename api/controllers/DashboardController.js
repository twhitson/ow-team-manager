/**
 * DashboardController
 * 
 * @description :: Server-side logic for the user dashboard
 */
 
module.exports = {
    
    index: function(req, res) {
        return res.view('private/dashboard', {layout: 'layouts/private'});
    }
    
}