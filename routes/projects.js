'use strict';

var spawn = require('child_process').spawn,
	config = require('../config/global'),
	fs = require('fs'),
	path = '/../pids/';

exports.projects = {
	editor: function (req, res) {
		if(req.session.ide || fs.readdirSync(path).length >= 3){
			return res.redirect('/ide/?p='+req.session.port);
		}
		var rndPort = 3131;//Math.floor((Math.random(new Date().getTime()) * 9000) + 1000);
		var c9ide = spawn(config.c9path, ['-l', '127.0.0.1', '-p', rndPort, '-w', '/home/naomay/git/project/']);
		req.session.ide = c9ide.pid;
		req.session.port = rndPort;
		console.log("Try create pid");
		if(!fs.existsSync(__dirname+path)){
			fs.mkdir(path,function(e){
				if(!e){
					console.log("Write pid file:",path+c9ide.pid);
					fs.writeFileSync(path+c9ide.pid+'.pid',c9ide.pid);
				}else{
					console.log(e);
				}
			});
		}else{
			console.log("Dir exists write file sync",path+c9ide.pid);
			fs.writeFileSync(path+c9ide.pid+'.pid',c9ide.pid);
		}
		c9ide.stdout.on('data', function (data) {
			if( data.toString().indexOf('initialized.') !== -1){
				res.redirect('/ide/?p='+rndPort);
			}
		});
	},
	dashboard: function(req, res){
		console.log("dashboard");
		console.log(module.filename,fs.readdirSync(require("path").normalize(__dirname+path)).length);
		var rndPort = 3131;//Math.floor((Math.random(new Date().getTime()) * 9000) + 1000);
		if(req.session.ide || fs.readdirSync(require("path").normalize(__dirname+path)).length>0){
			//res.redirect('/ide/?p='+rndPort);
		}else{
		var c9ide = spawn(config.c9path, ['-l', '127.0.0.1', '-p', rndPort, '-w', '/home/naomay/git/project/']);
		req.session.ide = c9ide.pid;
		req.session.port = rndPort;
		fs.writeFileSync(require("path").normalize(__dirname+path)+c9ide.pid+'.pid',rndPort);
			c9ide.stdout.on('data', function (data) {
				console.log(data.toString());
				if( data.toString().indexOf('initialized.') !== -1){
					//res.redirect('/ide/?p='+rndPort);
				}
			});
		}
	}
}
