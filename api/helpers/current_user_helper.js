module.exports = function(req, res, next){
	res.locals.user = req.sessions.user || {};
	next();
}
