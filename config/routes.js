

















module.exports = function (app, handle) {
	this._app = app;
	this._handle = handle;
	this.init = function () {

		_app.get('/404', function (req, res, next) {
			next()
		});

		_app.get('/', handle.index);
		_app.get('/signup', handle.sessions.signup);
		_app.post('/signup', handle.user.create);
		_app.get('/signin', handle.sessions.signin);
		_app.post('/signin', handle.sessions.new);
		_app.get('/logout', handle.sessions.destroy);
		_app.get('/active/:query/:hash', handle.user.active_email);
		_app.get('/forgot', handle.forgot.forgot);
		_app.post('/forgot_form', handle.forgot.forgot_form);
		_app.get('/forgot/:query/:hash', handle.forgot.reset);
		_app.get('/editor', handle.projects.editor);
		_app.get('/cide', handle.projects.dashboard);
		_app.post('/passwordreset', handle.forgot.new);

		return _app
	}
	return this;
}
