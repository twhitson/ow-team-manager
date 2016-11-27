/* global User */

/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 */

module.exports = {
    
    login: function(req, res) {
        User.findOne({
            email: req.param('email')
        }, function foundUser(err, user) {
            if (err) return res.negotiate(err);
            if (!user) return res.notFound();
            
            require('machinepack-passwords').checkPassword({
                passwordAttempt: req.param('password'),
                encryptedPassword: user.password
            }).exec({
                error: function(err) {
                    return res.negotiate(err);
                },
                incorrect: function() {
                    return res.notFound();
                },
                success: function() {
                    req.session.me = user.id;
                    
                    return res.ok();
                }
            });
        });
    },
    
	createaccount: function(req, res) {
        require('machinepack-passwords').encryptPassword({
            password: req.param('password')
        })
        .exec({
            error: function (err){
                return res.negotiate(err);
            },
            success: function (encryptedPassword){
                User.create({
                    name: req.param('name'),
                    email: req.param('email'),
                    password: encryptedPassword,
                    lastLoggedIn: new Date()
                }, function userCreated(err, newUser) {
                    if (err) {
                        if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'unique') {
                            return res.emailAddressInUse();
                        }
                    }
                    return res.json({id: newUser.id});
                });
            },
        });
	},
	
	logout: function(req, res) {
        req.session.destroy(function() {
            return res.redirect('/');
        });
}
	
};