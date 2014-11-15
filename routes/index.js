'use strict';

exports.index = function (req, res) {
	if (req.session.uid) {
		res.render('dashboard', {auth: true});
	} else {
		if (req.session.errors){
			res.render('signin', {errors: req.session.errors});
			req.session.errors = null
		} else if(req.session.forgot){
			res.render('newpassword');
		}else{
			res.render('signin');
		}
	}
};
