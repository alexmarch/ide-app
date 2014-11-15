var options = require('../../config/proxy.js'),
debug = require('debug')('proxy'),
httpProxy = require('http-proxy'),
proxyConfig = require('./config/proxy.js'),

module.export = function ProxyService(opt){
	this.proxy = httpProxy.createProxyServer(proxyConfig).listen(opt.port);
	this.proxy.on("error", this.error);
};

proxyService.prototype = {
	error: function(err, req, res){
		debug("Proxy error:", err);
	}
}
