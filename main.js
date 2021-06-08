/*
    Uses express, dbcon for database connection, body parser to parse form data
    handlebars for HTML templates
*/

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
// uses main.handlebars as template AKA defaultlayout
var handlebars = require('express-handlebars').create({
        defaultLayout:'main',
        });

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
// app.set('port', process.argv[2]);
app.set('port', 7919)   // sets port on flip1.engr.oregonstate.edu:8953 or 7919
app.set('mysql', mysql);
app.use('/movies', require('./movies.js')); 
app.use('/customers', require('./customers.js'));
app.use('/ticket_purchases', require('./ticketpurchases.js'));
app.use('/showings', require('./showings.js')); 
app.use('/genres', require('./genres.js')); 
app.use('/', express.static('public'));


// boilerplate error handlers
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
