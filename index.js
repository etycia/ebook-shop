// init  modules call
let fs = require('fs');
let readline = require('readline');

const order = require(__dirname + '/controller/order.js');
const file = "data/products.json";
let book;
//const tpl = "view/products.tpl";

//console.log(order);

// Reading products file
fs.readFile(file, 'utf8', (_err, file) => {
    book = JSON.parse(file);
    console.log("Bienvenue\nVoici les produits disponibles :\n");
    start(book);
});

// encapsultate into a function for delayed function call
function start(book){
    getAllProducts(book);

    // Stdin listen
    var rl = readline.createInterface({input: process.stdin, output: process.stdout, terminal: false});
    rl.on("line",(id)=>{
        order.orderProductById(id, book, file);
    });
    
   
};

// Function get all products
function getAllProducts(book){
    //var result = "";
    book.forEach(element => {
        console.log(`# ${element.id} - ${element.name} / ${element.EUR_price} / ${element.orders_counter} \n`);
    });
}












