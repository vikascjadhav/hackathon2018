var express = require('express');
var router = express.Router();

var Client = require('node-rest-client').Client;
 
var client = new Client();

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

//http://localhost:3000/api/Client
module.exports = router;
