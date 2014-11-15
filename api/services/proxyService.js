var options = require('../../config/proxy'),
debug = require('debug')('proxy'),
httpProxy = require('http-proxy');

function ProxyService(opt){
	opt = opt || {};
	debug("Proxy options:",opt, "port:", opt.port || 8080, "proxy path options:", options);
	this.proxy = httpProxy.createProxyServer(options).listen(opt.port || 8080);
	this.proxy.on("error", this.error);
};

ProxyService.prototype = {
	error: function(err, req, res){
		debug("Proxy error:", err);
	}
}

module.exports = ProxyService;
