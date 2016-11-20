
/**
 * PublicController
 * 
 * @description :: Server-side logic for public pages
 */
 
module.exports = {
    index: function(req, res) {
        return res.view('public/login');
    }
};