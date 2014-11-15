// Generated by CoffeeScript 1.7.1
(function () {
	var Q, crypto, db, user_crypto;
	crypto = require('crypto');
	db = require('./config/db');
	Q = require('q');

	user_crypto = {
		has_secure_password: function (pwd, salt) {
			var deffered, _salt;
			if (salt == null) {
				salt = crypto.randomBytes(128).toString("base64");
			}
			deffered = Q.defer();
			_salt = salt;
			if (pwd) {
				crypto.pbkdf2(pwd, _salt, 2000, 128, function (err, hash_pwd) {
					var key;
					key = hash_pwd.toString('base64');
					deffered.resolve({
						hash_key: key,
						salt_key: _salt
					});
				});
			} else {
				deffered.reject(new Error("Password error !"));
			}
			return deffered.promise;
		},
		unique_email: function (email) {
			var deffered;
			deffered = Q.defer();
			db.q("select * from users where email like ?", [email]).then(function (user) {
				if (user && user.length > 0) {
					return deffered.resolve(false);
				} else {
					return deffered.resolve("YES", function (err) {
						return deffered.reject(new Error(err));
					});
				}
			});
			return deffered.promise;
		},
		unique_userid: function (userid) {
			var deffered;
			deffered = Q.defer();
			db.q("select * from users where userid like ?", [userid]).then(function (user) {
				if (user && user.length > 0) {
					return deffered.resolve(false);
				} else {
					return deffered.resolve("YES", function (err) {
						return deffered.reject(new Error(err));
					});
				}
			});
			return deffered.promise;
		},
		check_email: function (email, email_confirm) {
			var re;
			if (email_confirm == null) {
				email_confirm = email;
			}
			re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (email === email_confirm && re.test(email)) {
				return true;
			}
			return false;
		},
		activation_email: function (hash) {
			var deffered = Q.defer();
			db.q("SELECT user_id FROM active_email WHERE hash=? and date>=CURRENT_TIMESTAMP limit 1", [hash]).then(function (ids) {
				if (ids && ids.length > 0) {
					db.q("UPDATE users SET active=1 WHERE id=?", [ids[0].user_id]).then(function (user) {
						db.q("DELETE FROM active_email WHERE hash=?", [hash]);
						deffered.resolve(ids[0].user_id);
					});
				} else {
					deffered.reject(new Error("Activation code not found !"));
				}
			});
			return deffered.promise;
		}
	};
	module.exports = user_crypto;
}).call(this);

//# sourceMappingURL=user_crypto.map
