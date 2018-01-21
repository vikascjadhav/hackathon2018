var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var transact = require('./routes/transact');

var app = express();


var Client = require('node-rest-client').Client;
 
var client = new Client();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/transact', transact);




app.post('/submitOrder', function(req, res) {
  console.log(req.body);
  var args = {
    data: JSON.stringify(req.body),
    headers: { "Content-Type": "application/json" }
  };

  console.log(args)
  client.post("http://localhost:3000/api/SubmitOrder", args, function (data, response) {    
    console.log(data);        
    if(response.statusCode === 200) {
      res.send('submitOrder successful to ETF BlockChain Network transactionId = '+data.transactionId);
    } else {
      res.send('Request Failed');
    }
  });


  
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
