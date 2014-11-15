var db = require('../config/db'),
	email = require('../noamay.src/libs/email'),
	crypto = require('crypto'),
	config = require('../config/global'),
	has_secure_password = require('../user_crypto').has_secure_password;

module.exports = {
	forgot: function (req, res) {
		res.render('forgot')
	},
	forgot_form: function (req, res) {
		db.q("SELECT * from users WHERE email=?", [req.body.email]).then(function (user) {
			if (user && user.length > 0) {
				var forgothash = crypto.randomBytes(128).toString('base64').replace(/\//g, '');
				db.q("INSERT INTO forgotpwd (email,hash,date) VALUES(?,?,DATE_ADD(NOW(),INTERVAL 1 DAY))", [req.body.email, forgothash]).then(function (r) {
					var url = 'http://' + config.host + '/forgot/password/' + forgothash;
					console.log(url);
					email.forgot('noreply@noamay.com', req.body.email, url, function (err) {
						console.log("Error ", err);
					});
					res.render("forgot", {
						info: "Activation code has been sent to registered email address."
					});
					return;
				}, function (err) {
					res.render("forgot", {
						errors: "Error email address !" + err
					});
				});
			} else {
				res.render("forgot", {
					errors: "Error email address !"
				});
			}
		}, function (err) {
			res.render("forgot", {
				errors: "Error email address !" + err
			});
		});
	},
	reset: function (req, res) {
		if (req.params.hash) {
			db.q("SELECT * FROM forgotpwd WHERE hash=? and date>=CURRENT_TIMESTAMP limit 1", [req.params.hash]).then(function (fp) {
				if (fp && fp.length > 0) {
					db.q('DELETE FROM forgotpwd WHERE id=?', [fp[0]['id']]);
					req.session.regenerate(function () {
						req.session.forgot = fp[0]['email'];
						res.redirect('/');
					});
				} else {
					res.redirect('/');
				}
			}, function (err) {
				res.redirect('/');
			});
		}
	},
	new: function (req, res) {
		if (req.body.password && req.session.forgot) {
			db.q("select * from users where email = ? limit 1", [req.session.forgot]).then(function (user) {
				has_secure_password(req.body.password, null).then(function (pwd) {
					db.q("UPDATE users SET password=?, salt=? WHERE email=?", [pwd.hash_key,pwd.salt_key, req.session.forgot]).then(function (r) {
						res.render('signin');
					});
					req.session.forgot = null;
				}, function (err) {
					req.session.forgot = null;
					res.render('newpassword', {errors: "Reset password error !"});
				});
			});
		}
	}
}
