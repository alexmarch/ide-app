has_secure_password = require('../user_crypto').has_secure_password
check_email = require('../user_crypto').check_email
db = require '../config/db'
config = require('../config/global')

exports.sessions = {
	signin: (req, res) ->
		if req.session.user_id
			res.redirect '/'
		else
			res.render 'signin'
	signup: (req, res) ->
		if req.session.user_id
			res.redirect '/'
		else
			res.render 'signup'
	destroy: (req, res) ->
		req.session.destroy()
		res.redirect '/'
	new: (req, res) ->
		if check_email(req.body.email, null)
			db.q("select * from users where email = ? limit 1", [req.body.email]).then (user) ->
				if user and user.length > 0
					has_secure_password(req.body.password, user[0].salt).then (pwd) ->
						if user[0].password == pwd.hash_key && user[0].active == 1
							req.session.regenerate (err) ->
								req.session.user_id = user[0].id
								res.redirect "/"
						else
							res.render "signin", errors: "Authentication error !"
				else
					res.render "signin", errors: "Email address not exist !"


}
