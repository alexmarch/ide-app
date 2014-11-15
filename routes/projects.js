'use strict';

var	debug = require('debug')('project'),
c9ideOptions = require('../config/c9ide'),
C9ideService = require('../api/services/c9ideService'), 
proxyService, c9ideService;

exports.projects = {
	editor: function (req, res, next) {
		
		if(!req.session.user || req.params.userid !== req.session.user.userid) {
			return res.redirect('/');
		};

		debug("Run editor...", req.app.get('proxyService'));

		c9ideService = new C9ideService(c9ideOptions);

		c9ideService.run(function(data){
			debug('Running c9ide...',data);
		});

		// proxyService = req.app.get('proxyService');

		// proxyService.proxy.web(req, res, { target: "http://192.163.201.155:3131" });
		
		// proxyService.proxy.on('error', function(err){
		// 	console.log(err);
		// });
		
		next();
		// if(req.session.ide || fs.readdirSync(path).length >= 3){
		// 	return res.redirect('/ide/?p='+req.session.port);
		// }
		// var rndPort = 3131;//Math.floor((Math.random(new Date().getTime()) * 9000) + 1000);
		// var c9ide = spawn(config.c9path, ['-l', '127.0.0.1', '-p', rndPort, '-w', '/home/naomay/git/project/']);
		// req.session.ide = c9ide.pid;
		// req.session.port = rndPort;
		// console.log("Try create pid");
		// if(!fs.existsSync(__dirname+path)){
		// 	fs.mkdir(path,function(e){
		// 		if(!e){
		// 			console.log("Write pid file:",path+c9ide.pid);
		// 			fs.writeFileSync(path+c9ide.pid+'.pid',c9ide.pid);
		// 		}else{
		// 			console.log(e);
		// 		}
		// 	});
		// }else{
		// 	console.log("Dir exists write file sync",path+c9ide.pid);
		// 	fs.writeFileSync(path+c9ide.pid+'.pid',c9ide.pid);
		// }
		// c9ide.stdout.on('data', function (data) {
		// 	if( data.toString().indexOf('initialized.') !== -1){
		// 		res.redirect('/ide/?p='+rndPort);
		// 	}
		// });
	},
	dashboard: function(req, res){
		// var rndPort = 3131;//Math.floor((Math.random(new Date().getTime()) * 9000) + 1000);
		// if(req.session.ide || fs.readdirSync(require("path").normalize(__dirname+path)).length>0){
		// 	//res.redirect('/ide/?p='+rndPort);
		// }else{
		// var c9ide = spawn(config.c9path, ['-l', '127.0.0.1', '-p', rndPort, '-w', '/home/naomay/git/project/']);
		// req.session.ide = c9ide.pid;
		// req.session.port = rndPort;
		// fs.writeFileSync(require("path").normalize(__dirname+path)+c9ide.pid+'.pid',rndPort);
		// 	c9ide.stdout.on('data', function (data) {
		// 		console.log(data.toString());
		// 		if( data.toString().indexOf('initialized.') !== -1){
		// 			//res.redirect('/ide/?p='+rndPort);
		// 		}
		// 	});
		// }
	}
}
