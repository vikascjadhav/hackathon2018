var express = require('express');
var router = express.Router();

var Client = require('node-rest-client').Client;
 
var client = new Client();
/* GET home page. */
router.get('/', function(req, res, next) {
	client.get("http://localhost:3000/api/Client", function (data, response) {
    	console.log(data);
	});

   res.render('index', { title: 'ETF Network App' });
});

//http://localhost:3000/api/Client
module.exports = router;
