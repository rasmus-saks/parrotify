var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var compression = require('compression');
var browserify = require('browserify-middleware');
var stylus = require('stylus');
var nib = require('nib');

var app = express();

browserify.settings.development('minify', true);
app.use('/js/parrotify.min.js', browserify(__dirname + '/public/js/main.js'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(compression());

var publicDir = path.join(__dirname, 'public');

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib())
    .import('nib');
}
app.use(stylus.middleware({
  src: publicDir,
  dest: publicDir,
  compile: compile
}));
app.use(express.static(publicDir));
app.use("/bower_components", express.static(path.join(__dirname, 'bower_components')));

app.use("/", require("./routes/index"));


module.exports = app;