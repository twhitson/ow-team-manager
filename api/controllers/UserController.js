/* global User */

/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	createaccount: function(req, res) {
        var Passwords = require('machinepack-passwords');
        
        Passwords.encryptPassword({
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
                })
            },
        });
	}
};

