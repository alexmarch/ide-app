var options = require('../../config/proxy.js'),
debug = require('debug')('proxy'),
httpProxy = require('http-proxy'),
proxyConfig = require('./config/proxy.js');

module.exports = function ProxyService(opt){
	this.proxy = httpProxy.createProxyServer(proxyConfig).listen(opt.port);
	this.proxy.on("error", this.error);
};

ProxyService.prototype = {
	error: function(err, req, res){
		debug("Proxy error:", err);
	}
}
