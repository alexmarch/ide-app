'use strict';

var debug = require('debug')('c9ide'),
spawn = require('child_process').spawn;

function c9ideService(options){
	this.options = options || {};
};

c9ideService.prototype = {
	run: function(cb){
		debug("Call run with options", this.options);
		var c9ide = spawn(this.options.script_path, ['-l', this.options.ide_ip, '-p', this.options.ide_port, 
			'-w', this.options.workspace_path]);
		c9ide.stdout.on('data', function(data) {
			cb(data);
		});
		c9ide.stderr.on('data', function(data) {
			debug('Error',data);
		};
	}
}
module.exports = c9ideService;
