var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');

// database connection info
const databaseConnection = process.env.MONGODB_URI || require('../data/DatabaseConnection.json');

var mongoose = require('mongoose');
mongoose.connect(databaseConnection , function(err){
  if (err) {
    console.log("Error connecting to MongoDB");
    process.exit(1);
  }
});

var app = express();
app.use(cors());

//Routes
var indexRouter = require('./routes/index');
var sets = require('./routes/sets');
var card = require('./routes/card');

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sets', sets);
app.use('/card', card);

//close connection on quit
process.on('SIGINT', function(){
  mongoose.connection.close(function(){
   console.log("Closing the mongodb connection");
    process.exit(0);
  });
});

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//error handler
app.use(function(err, req, res, next) {
  //set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
