'use strict';
(function () {
	var check_email, config, db, has_secure_password;
	has_secure_password = require('../user_crypto').has_secure_password;
	check_email = require('../user_crypto').check_email;
	db = require('../config/db');
	config = require('../config/global');

	var cookie = require('cookie');
	var mysql = require('mysql');
	var spawn = require('child_process').spawn;
	var fs = require('fs');

	exports.sessions = {
		signin: function (req, res) {
			if (req.session.uid) {
				return res.redirect('/dashboard');
			} else {
				return res.render('signin');
			}
		},
		signup: function (req, res) {
			if (req.session.uid) {
				return res.redirect('/');
			} else {
				return res.render('signup');
			}
		},
		destroy: function (req, res) {
			var c9sid = cookie.parse(req.headers.cookie)['c9connect.sid'];
			if(c9sid){
				db.q("SELECT * from c9_sessions WHERE sid =?",[c9sid]).then(function(result){
					if(result && result.length>0){
						try{
							var sess = JSON.parse(result[0]['session']);
							if (sess && sess.uid){
								db.q("DELETE FROM c9_sessions WHERE sid=?",[c9sid]).then(function(r){
									console.log("c9 session update", r);
								});
							}
						}catch(err){
							console.log("Session error:", err);
						}
					}
				});
			}
			if(req.session.ide){
				var path = '/../pids/';
				path = require("path").normalize(__dirname+path);
				if(fs.existsSync(path+req.session.ide+'.pid')) fs.unlinkSync(path+req.session.ide+'.pid');
				spawn('kill',[req.session.ide]);
			}
			req.session.destroy();
			return res.redirect('/');
		},
		"new": function (req, res) {
			return db.q("select * from users where userid = ? limit 1", [req.body.email]).then(function (user) {
				if (user && user.length > 0) {
					return has_secure_password(req.body.password, user[0].salt).then(function (pwd) {
						if (user[0].password === pwd.hash_key && user[0].active === 1) {
							return req.session.regenerate(function (err) {
								req.session.uid = user[0].id;
								req.session.sid = cookie.parse(req.headers.cookie)['connect.sid'];
								return res.redirect("/");
							});
						} else {
							return res.render("signin", {
								errors: "Authentication error !"
							});
						}
					});
				} else {
					return res.render("signin", {
						errors: "You not registered !"
					});
				}
			});
		}
	};

}).call(this);

//# sourceMappingURL=sessions.map

