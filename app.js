/**************************************

	Bitcoin / Litecoin / Altcoin Faucet
	April 2014, clapyohands <clapyohands1@gmail.com>
	https://github.com/clapyohands/cryptofaucet-node

	See config.js for Configuration Variables
	Edit views/inc/nav.pug to add navigation elements
	Edit views/inc/rightcol.pug and views/inc/leftcol.pug to manage advertisements and other text in the sidebars

	Requirements:
	express 3.x (not tested with express 4)
	pug
	node-bitcoin
	iz
	nedb
	querystring

***************************************/
var configura = {
    protocol: 'http',
    user: 'your_rpc_user_here',
    pass: 'your_rpc_password_here',
    host: '127.0.0.1',
    port: 'your_rpc_port_here',
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

// certicates
var privateKey = fs.readFileSync( 'privatekey.pem' );
var certificate = fs.readFileSync( 'certificate.pem' );
var credentials = {key: privateKey, cert: certificate};

//Express Configuration
//app.set('port', process.env.PORT || 8080); // What port to use to the webserver -> define here
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.logger('dev'));
//app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: config.session_secret }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.csrf());
app.use(function(req, res, next){
	//res.cookie('TOKEN', req.csrfToken());
	res.locals.csrftoken = req.csrfToken();
	next();
});
app.disable('x-powered-by');
app.use(express.errorHandler());


// Express Routes
app.get('/', routes.index);
app.get('/captcha', routes.captcha);
app.get('/submit', function(req,res){res.redirect(302,'/')});
app.post('/submit', routes.submit);
app.get(config.dashboard.path, routes.dashboard);
app.post(config.dashboard.path, routes.dashboard);


var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

// For http
httpServer.listen(9090);
// For https
httpsServer.listen(8090);



// Run Faucet Processor
processor.start();

