var express = require('express');
var router = express.Router();

var Client = require('node-rest-client').Client;
 
var client = new Client();
/* GET home page. */
router.get('/', function(req, res, next) {
	client.get("http://localhost:3000/api/ETFInventory", function (data, response) {
    	console.log(response.statusCode);
    	jsonData = data;
    	//res.render('index', { title: 'ETF Network App1' , jsonData: JSON.stringify(jsonData) });

		res.render('index', { title: 'ETF Network App' , jsonData: jsonData });    	//res.render('index', { title: 'ETF Network App' , data: 'vikas' });
	});

  
});

router.get('/transact', function(req, res, next) {
	//console.log('URL',req);
  	//res.send('respond with a resource');
  	jsonData = {};
  	res.render('transact', { title: 'ETF Network App' , jsonData: jsonData });
});

//http://localhost:3000/api/Client
module.exports = router;
