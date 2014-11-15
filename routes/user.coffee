db = require '../config/db'
has_secure_password = require('../user_crypto').has_secure_password
unique_email = require('../user_crypto').unique_email
check_email = require('../user_crypto').check_email
activation_email = require('../user_crypto').activation_email
config = require '../config/global'
email = require '../noamay.src/libs/email'
crypto = require 'crypto'

exports.user = {
	create: (req, res) ->
		if check_email req.body.email, req.body.email_confirm
			unique_email(req.body.email).then (unique) ->
				if unique
					has_secure_password(req.body.password, null).then (pwd) ->
						db.q("INSERT INTO users(email,password,salt,active) VALUES(?,?,?,false)",
							[req.body.email, pwd.hash_key, pwd.salt_key]).then (user) ->
								active_hash = crypto.randomBytes(128).toString('base64').replace(/\//g,'')
								url = 'http://'+config.host+'/active/email/' + active_hash
								db.q("INSERT INTO active_email (user_id,hash,date) VALUES(?,?,DATE_ADD(NOW(),INTERVAL 1 DAY))",[user.insertId, active_hash]).then (active)->
									email.successfuly_auth "noreply@noamay.com", req.body.email, url
									res.render "signup", info: "Activation code successfully send to your email address !"
				else
					res.render "signup", errors: "This email address already taken !"
		else
			res.render "signup", errors: "Error email address !"

	active_email: (req, res)->
		if req.params && req.params.hash
			activation_email(req.params.hash)
			.then((userid)->
						console.log "Activation email:", userid
						req.session.regenerate (err) ->
							if !err
								req.session.user_id = userid
								res.redirect "/"
					,(err)->
						req.session.errors = "Activation code error !"
						res.redirect '/'
				)

		else
			res.render "signup", errors: "Active code errors!"
}

