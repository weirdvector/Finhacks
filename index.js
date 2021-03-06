var express    = require("express");
var app        = express();
var mongoose   = require("mongoose");
var bodyParser = require('body-parser');
var PORT       = process.env.port || 3000;
var config     = require('./config');

//setup body parser for when post requests are sent
app.use(bodyParser.json({limit: '50mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true,
	limit: '50mb',
  parameterLimit: 50000
})); // for parsing application/x-www-form-urlencoded

//connect to mongodb database
//make sure you run "use finhacks2016 in mongodb console"
mongoose.connect('mongodb://localhost/finhacks2016');

var models = require('./models.js');

require('./api/profile')(app, models);
require('./api/device')(app, models);
require('./api/uploads')(app, models);
require('./api/login')(app, models);
require('./api/transactions.js')(app, models);
require('./api/message')(app, models);

// Configuration
app.use(express.static(__dirname + '/uploads'));

//if it's not an API route, go to the front end login
app.use(express.static(__dirname + '/frontend'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/frontend/altpay.html');
});

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/frontend/altpay.html');
});
//secret for signing tokens
app.set('secret', config.secret);

app.listen(PORT);

console.log("Server started and listening on port " + PORT);
