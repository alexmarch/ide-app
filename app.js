var express = require('express');
var db = require('./config/db');
var http = require('http');
var path = require('path');
var app = express();
var helpers = require('./helpers/helpers');
var handler = require('./routes/handle');
var appRoutes = require('./config/routes')(app, handler);
var debug = require('debug')('app');
//var MongoStore = require('connect-mongo')(express);
var MySQLStore = require('connect-mysql')(express),
ProxyService = require('./api/services/proxyService'),
proxy = new ProxyService({port: process.env.PROXY_PORT });

app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || 'localhost')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('proxy', proxy);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.session({
	key: 'connect.sid',
	secret: 'v1234',
	store: new MySQLStore({config: db.dev}),
	proxy: true
}));

app.use(app.router);
app.use(helpers(app));

app.use(function (req, res, next) {
	res.status(404)
	if (req.accepts('html')) {
		res.render('404', {url: req.url })
		return;
	}
	res.type('txt').send('Page not found')
});

appRoutes.init();

if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

db.init();

http.createServer(app).listen(app.get('port'), app.get('host'), function () {
	debug("App server start on port:[" + app.get('port') + " ], host:[" + app.get('host') + "]");
});
