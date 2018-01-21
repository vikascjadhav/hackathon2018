var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/transact', function(req, res, next) {
	//console.log('URL',req);
  	//res.send('respond with a resource');
  	jsonData = {};
  	res.render('transact', { title: 'ETF Network App' , jsonData: jsonData });
});

module.exports = router;
