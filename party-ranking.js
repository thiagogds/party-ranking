/** Servidor do partyranking
 *
 * @author : Rafael Erthal
 * @since : 2013-05
 */

var mongoose = require('mongoose'),
    express = require('express'),
    config  = require('./config.js');

mongoose.connect('mongodb://' + config.mongodb.security.username + ':' + config.mongodb.security.password + '@' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.db);

/*  Servidor */
var server = express();
require('./controllers/Party')(server);
require('./controllers/Vote')(server);
require('./controllers/Category')(server);
server.all('/*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});
server.configure(function () {
    server.use(require('passport').session);
})
server.listen(config.server.port);

/*  Frontend */
var frontend = express();
frontend.configure(function () {
    "use strict";
    frontend.use('/js', express.static('public/js'));
    frontend.use('/css', express.static('public/css'));
    frontend.use('/images', express.static('public/images'));
});
frontend.get('/:id?', function(req, res){
    res.sendfile(__dirname + '/public/index.html');
});
frontend.listen(config.frontend.port);