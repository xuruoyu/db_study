/**
 * author@XuRuoYu
 * 2015/09/01
 **/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mysql = require('mysql');
var setting = require('./setting');
var app = express();

//console.log(module);
//MD5例子
//var utility = require('utility');
//console.log(utility.md5('1111'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());



app.use(express.static(path.join(__dirname, 'public')));
//重定向到console目录下,并配合angular路由
app.use(express.static(path.join(__dirname, 'public/console')));
var options = {
  index : __dirname + '/public/console/index.html'
};
app.use(express.static('/',options));

app.use(function (req, res, next) {
    if(req.path.indexOf('/server')>=0){
        next();
    }else{ //angular启动页
        res.sendFile(__dirname + '/public/console/index.html');
    }
});


//路由表(无需登陆)
var noLogin = require('./routes/no_login');
app.use(noLogin);

//需要登陆
var needLogin = require('./routes/need_login');
app.use(needLogin);

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
