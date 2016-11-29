/**
 * DashboardController
 * 
 * @description :: Server-side logic for the user dashboard
 */
 
module.exports = {
    
    index: function(req, res) {
        return res.view('private/dashboard', {layout: 'layouts/private'});
    },
    
    createaccount: function(req, res) {
        return res.view('private/createaccount', {layout: 'layouts/private'});
    }
    
}