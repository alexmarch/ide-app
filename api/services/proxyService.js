
debug = require('debug')('proxy'),
httpProxy = require('http-proxy');

function ProxyService(options, server_opts){
	server_opts = server_opts || {};
	options = options || {};
	debug("Proxy options:",server_opts, "port:", server_opts.port || 8080, "proxy path options:", options);
	this.proxy = httpProxy.createProxyServer(options);
	this.proxy.on("error", this.error);
};

ProxyService.prototype = {
	error: function(err, req, res){
		debug("Proxy error:", err);
	}
}

module.exports = ProxyService;
