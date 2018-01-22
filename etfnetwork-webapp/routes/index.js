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

router.get('/etf', function(req, res, next) {
	client.get("http://localhost:3000/api/ETFInventory", function (data, response) {
    	console.log(response.statusCode);
    	jsonData = data;
    	//res.render('index', { title: 'ETF Network App1' , jsonData: JSON.stringify(jsonData) });
		res.render('index', { title: 'ETF Network App' , jsonData: jsonData });    	//res.render('index', { title: 'ETF Network App' , data: 'vikas' });
	});

  
});

router.get('/transact', function(req, res, next) {
	var clients = [];
	var aps= [];
	var apAgents = [];
  	client.get("http://localhost:3000/api/Client", function (data, response) {
	    	
	    	data.forEach(function(ele,index) {
	    		clients.push('resource:'+ele.$class+'#' + ele.clientId);
	    	})

	    	client.get("http://localhost:3000/api/AP", function (data, response) {
	    		data.forEach(function(ele,index) {
	    			aps.push('resource:'+ele.$class+'#' + ele.apId);
	    		})
	    		client.get("http://localhost:3000/api/APAgent", function (data, response) {
		    		data.forEach(function(ele,index) {
		    			apAgents.push('resource:'+ele.$class +'#'+ ele.agentId);
		    		})
	    			//"resource:org.etfnet.AP#AP_01",
					jsonData = {};
					jsonData.clients = clients;
					jsonData.aps = aps;
					jsonData.apAgents = apAgents;
  					res.render('transact', { title: 'ETF Network App' , jsonData: jsonData, clients : clients, aps : aps, apAgents: apAgents });	    			 		
  					//console.log(jsonData);
				})		 
			})		    
	})
  	
  
});


router.get('/history', function(req, res, next) {
	
  	client.get("http://localhost:3000/api/system/historian", function (data, response) {
  		var jsonData = data;
 	    res.render('history', { title: 'ETF Network App' , jsonData: jsonData});	    			 		
	})
  	
  
});

router.get('/validate', function(req, res, next) {
	
  	   res.render('validate', { title: 'ETF Network App' });	    			 		
  	
  
});

//http://localhost:3000/api/Client
module.exports = router;
