crypto = require 'crypto'
db = require './config/db'
Q = require 'q'

user_crypto = {

has_secure_password: (pwd, salt = crypto.randomBytes(128).toString("base64")) ->
  deffered = Q.defer()
  _salt = salt
  if pwd
    crypto.pbkdf2 pwd, _salt, 2000, 128, (err, hash_pwd) ->
      key = hash_pwd.toString 'base64'
      deffered.resolve({hash_key:key, salt_key: _salt})
      return
  else
    deffered.reject new Error "Password error !"
  return deffered.promise

unique_email: (email) ->
  deffered = Q.defer()
  db.q("select * from users where email like ?", [email]).then (user) ->
    if user and user.length > 0
      deffered.resolve false
    else deffered.resolve "YES"
    ,(err) ->
      deffered.reject new Error err
  return deffered.promise

check_email: (email, email_confirm=email) ->
  re = /^\w+@{1}\w+\.[a-z]{2,3}$/
  if email == email_confirm and re.test email
    return true
  return false

activation_email: (hash)->
	deffered = Q.defer()
	db.q("SELECT user_id FROM active_email WHERE hash=? and date>=CURRENT_TIMESTAMP limit 1",[hash]).then (ids)->
		if ids && ids.length>0
			db.q("DELETE FROM active_email WHERE hash=?",[hash]);
			db.q("UPDATE users SET active=true WHERE id=?",[ids[0].user_id]).then (user)->
				deffered.resolve ids[0].user_id
		else
			console.log "Reject new error"
			deffered.reject new Error "Activation code not found !"
	return deffered.promise
}

module.exports = user_crypto
