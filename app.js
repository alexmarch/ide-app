var express = require('express');
var db = require('./config/db');
var http = require('http');
var path = require('path');
var app = express();
var url = require('url');
var cookie = require('cookie');
var helpers = require('./api/helpers/helpers');
var handler = require('./routes/handle');
var proxy = require('express-http-proxy');
var appRoutes = require('./config/routes')(app, handler);

var debug = require('debug')('app');
//var MongoStore = require('connect-mongo')(express);
var MySQLStore = require('connect-mysql')(express);
var sessionStore = new MySQLStore({config: db.dev}),
ProxyService = require('./api/services/proxyService'),
options = require('./config/proxy'),
proxyService = new ProxyService({},{port: process.env.PROXY_PORT}),

c9ideOptions = require('./config/c9ide'),
C9ideService = require('./api/services/c9ideService'), 
proxyService, c9ideService;

// c9ideService = new C9ideService(c9ideOptions);
// c9ideService.run(function(data){
// 		debug('Running c9ide...',data.toString());
// });
var httpProxy = require('http-proxy');
var wsProxy = httpProxy.createProxyServer({ target: 'ws://127.0.0.1:3131', ws: true });

app.set('port', process.env.PORT || 3000);
app.set('host', process.env.APP_HOST || '192.163.201.155');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('proxyService', proxyService);


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
	store: sessionStore,
	proxy: true
}));

app.use(require('./api/helpers/current_user_helper'));
app.use(helpers(app));

// app.use('/:userid/:project',function(req, res, next){

// 		if(!req.session.user || req.params.userid !== req.session.user.userid) {
// 			return next();
// 		};
// 		console.log("dadasdasdada>>>>");
// 		debug("Run editor...", req.app.get('proxyService'));

// 		c9ideService = new C9ideService(c9ideOptions);

// 		c9ideService.run(function(data){
// 			debug('Running c9ide...',data.toString());
// 		});

// 		proxyService = req.app.get('proxyService');

// 		proxyService.proxy.web(req, res, { target: "http://" + c9ideOptions.ide_ip + ":" + c9ideOptions.ide_port });
		
// 		proxyService.proxy.on('error', function(err){
// 			console.log(err);
// 		});
// });

app.use('/api', proxy('http://' + c9ideOptions.ide_host + ':' + c9ideOptions.ide_port, {
  forwardPath: function(req, res) {
    return req.originalUrl;
  }
}));

app.use('/workspace', proxy('http://' + c9ideOptions.ide_host + ':' + c9ideOptions.ide_port, {
  forwardPath: function(req, res) {
    return req.originalUrl;
  }
}));

app.use('/php/develop', proxy('http://localhost:8000', {
  forwardPath: function(req, res) {
    console.log(require('url').parse(req.url));
    return require('url').parse(req.url).path;
  }
}));

app.use('/smith.io-ide', proxy('http://' + c9ideOptions.ide_host + ':' + c9ideOptions.ide_port, {
  forwardPath: function(req, res) {
  	debug("/smith.io-ide", req.originalUrl);
    return req.originalUrl;
  }
}));

app.use('/static', proxy('http://' + c9ideOptions.ide_host + ':' + c9ideOptions.ide_port, {
  forwardPath: function(req, res) {
    return req.originalUrl
  }
}));

app.use('/test/project', proxy('http://' + c9ideOptions.ide_host + ':' + c9ideOptions.ide_port, {
  forwardPath: function(req, res) {
    return require('url').parse(req.url).path;
  }
}));

app.use(app.router);

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

var server = http.createServer(app);
server.listen(app.get('port'), app.get('host'), function () {
	debug("App server start on port:[" + app.get('port') + "], host:[" + app.get('host') + "]");
});
server.on('upgrade', function (req, socket, head) {
	console.log("upgrade");
  wsProxy.ws(req, socket, head);
});
