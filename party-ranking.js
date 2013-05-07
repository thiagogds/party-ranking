/** Servidor do partyranking
 *
 * @author : Rafael Erthal
 * @since : 2013-05
 */

var mongoose = require('mongoose'),
    express = require('express'),
    config  = require('./config.js');

mongoose.connect('mongodb://' + config.mongodb.security.username + ':' + config.mongodb.security.password + '@' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.db);

var app = express();

app.use('/', express.static('public'));

require('./controllers/Auth')(app);
require('./controllers/Party')(app);
require('./controllers/Vote')(app);
require('./controllers/Category')(app);

/*  Ativando o server */
app.listen(config.server.port);
