//init 
var express = require('express');
const ejs = require('ejs')
const app = express();
var path = require("path");
var bodyParser = require("body-parser");
var hostname = '127.0.0.1';
var port = 3000;
let fs = require('fs');
let readline = require('readline');
const order = require(__dirname + '/controller/order.js');
//const products = require(__dirname + '/data/products.js');
var productIdToBuy = '';
// init end


// Middleware
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 
app.use('/public', express.static(__dirname + '/public'));
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

//
//app.post('/', (req, res) => res.send('What do you want?'));

app.get('/', async (req, res) => {
    var books = await getAllBook();
    res.render('index', {books:books});
});

app.get('/login', async (req, res) => {
    //var books = await getAllBook();
    res.render('login', {});
});


app.post('/', (req, res) => {
    var bookId = req.body.id;
    console.log(req.body);
    res.sendStatus(200);
    getBookById(bookId);
});

app.post('/login', (req, res) => {
    var username = req.body.username;
    var pwd = req.body.pwd;
    console.log(req.body);
    res.sendStatus(200);
    // controler l'authentification

});

app.listen(port, () => console.log(`Ebook shop app listening on port ${port}`));

app.all('/secret', (req, res, next) => {
    res.send('Accessing the secret section ...');
    console.log('Accessing the secret section ...');
    next(); // pass control to the next handler
  });