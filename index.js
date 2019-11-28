//init 
var express = require('express');
const ejs = require('ejs')
const app = express();
var path = require("path");
var bodyParser = require("body-parser");
var session = require("express-session");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var hostname = '127.0.0.1';
var port = 3000;
let fs = require('fs');
let readline = require('readline');
const order = require(__dirname + '/controller/order.js');
const Order = require(__dirname + '/controller/orderModel.js');
//const products = require(__dirname + '/data/products.js');
var productIdToBuy = '';
// init end


// Middleware
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 
app.use('/public', express.static(__dirname + '/public'));


//app.use(express.cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
//app.use(app.router);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ebook', {useNewUrlParser: true,  useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});

// schema
var ebookSchema = new mongoose.Schema({
  name: String,
  id: String,
  description: String,
  USD_price: Number,
  EUR_price: Number,
  file_link: String,
  creation_date: Date,
  orders_counter: Number
  
});

var userSchema = new mongoose.Schema({
    email : String,
    password : String,
    username : String
});

// ###MongoDB

var ebook = mongoose.model('ebook', ebookSchema);
var bookToSell = new ebook();

async function getBookById(id){
    return await ebook.find({_id : id});
}


async function getAllBook(){
    return await ebook.find({});
}

//      save book
function saveBook(objBook){
    var book = new ebook(objBook);
    
    book.save(function (err, book) {
        if (err) return console.error(err);
      });
}

const User = mongoose.model('users', userSchema);
//
//app.post('/', (req, res) => res.send('What do you want?'));

app.get('/', async (req, res) => {
    var books = await getAllBook();
    res.render('index', {books:books});
});

// AUTH avec Passport 
passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ email: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (password !== user.password) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

app.get('/login', async (req, res) => {
    //var books = await getAllBook();
    passport.authenticate('local', { successRedirect: '/users',
                                                    failureRedirect: '/login' })
    var message = "";
    res.render('login', {message : message});
});

app.get('/users', async (req, res) => {
    var books = await getAllBook();
    var message = "";
    res.render('users', {book : books});
});

//passport
app.post('/login', passport.authenticate('local', { successRedirect: '/users',
                                                    failureRedirect: '/login' }));
// passport

app.post('/', (req, res) => {
    var bookId = req.body.id;
    console.log(req.body);
    res.sendStatus(200);
    getBookById(bookId);
});


app.listen(port, () => console.log(`Ebook shop app listening on port ${port}`));

app.all('/secret', (req, res, next) => {
    res.send('Accessing the secret section ...');
    console.log('Accessing the secret section ...');
    next(); // pass control to the next handler
  });