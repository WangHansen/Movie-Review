var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var logger = require('morgan')
var mongoStore = require('connect-mongo')(session)
var port = process.env.PORT || 3000
var app = express()
var dbUrl = 'mongodb://localhost/movie'

mongoose.connect(dbUrl)

app.set('view engine', 'jade')
app.set('views', './app/views/pages')
app.use(bodyParser())
app.use(cookieParser())
app.use(session({
	secret: 'imooc',
	store: new mongoStore({
		url: dbUrl
	})
}))

if('development' ===  app.get('env')){
	app.set('showStackError', true)
	app.use(logger(':method :url :status'))
	app.locals.pretty = true
	mongoose.set('debug', true)
}

require('./config/routes')(app)

app.use(express.static(path.join(__dirname, 'public')))
app.locals.moment = require('moment')
app.listen(port)

console.log('Start Server')
