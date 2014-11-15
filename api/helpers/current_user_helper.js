module.exports = function(req, res, next){
	console.log("Session:", req.session.user);
	res.locals.user = req.session.user || {};
	next();
}
