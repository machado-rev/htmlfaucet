/**************************************

	HTMLCoin Faucet
	2019, Leandro Machado
	https://github.com/machado-rev/htmlfaucet

	See config.js for Configuration Variables
	Edit views/inc/nav.pug to add navigation elements
	Edit views/inc/rightcol.pug and views/inc/leftcol.pug to manage advertisements and other text in the sidebars

	Requirements:
	express 4
	pug
	node-bitcoin
	iz
	nedb
	querystring
	connect
	morgan
	body-parser
	cookie-parser
	express-session
	csurf
	errorhandler

***************************************/

// This data will be passed to our Bitcore
var configura = {
    protocol: 'http',
    user: 'change_daemon_user_here',
    pass: 'change_daemon_pass_here',
    host: '127.0.0.1',
    port: '4889', // MAIN: 4889, TEST: 14889, REG: 24889
  };

var RpcClient = require('bitcoin-core');
var btcClient = new RpcClient(configura);
//global
config = require('./config')
,iz = require('iz')
,bitcoin = require('bitcoin-core')
,client = new RpcClient(configura)
,db = require('./db')(config.database)
,processor = require('./processor');


//local
var express = require('express')
	,fs = require('fs')
	,routes = require('./routes')
 	,http = require('http')
 	,https = require('https')
	,path = require('path')
	,app = express();

// certicates - FOR PRODUCTION
var privateKey = fs.readFileSync( 'privatekey.pem' );
var certificate = fs.readFileSync( 'certificate.pem' );
var credentials = {key: privateKey, cert: certificate};


//Express Configuration
//app.set('port', process.env.PORT || 8080); // What port to use to the webserver -> define here
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// Old logger deprecated, using the package
var logger = require('morgan');
app.use(logger('combined'));
// Old bodyParser deprecated, using the package
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// Old cookieParser deprecated, using the package
var cookieParser = require('cookie-parser');
app.use(cookieParser);
// Old express.session deprecated, using the package
// try catch
var express_session = require('express-session');
app.use(express_session({ secret: config.session_secret, resave: true, saveUninitialized: true }));

app.use(express.static(path.join(__dirname, 'public')));
// Old csrf deprecated, using the package
var csrf = require('csurf');
app.use(csrf);

app.use(function(req, res, next){
	//res.cookie('TOKEN', req.csrfToken());
	res.locals.csrftoken = req.csrfToken();
	next();
});
app.disable('x-powered-by');
// Old errorHandler deprecated, using the package
var errorHandler = require('errorhandler');
app.use(errorHandler);

// Express Routes
app.get('/', routes.index);
app.get('/captcha', routes.captcha);
app.get('/submit', function(req,res){res.redirect(302,'/')});
app.post('/submit', routes.submit);
app.get(config.dashboard.path, routes.dashboard);
app.post(config.dashboard.path, routes.dashboard);

var httpServer = http.createServer(app);
// FOR PRODUCTION
var httpsServer = https.createServer(credentials, app);

// FOD DEV
//var httpsServer = https.createServer(app);

// For http
httpServer.listen(9090);
// For https
httpsServer.listen(8090);

// Run Faucet Processor
processor.start();
