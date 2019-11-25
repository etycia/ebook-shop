
let fs = require('fs');

function orderProductById(id, book, file){
    // incrémente le nb de commande
    var fileLink; // ebook path dl

    book.forEach(element => {
        //console.log(`${element.id} - ${element.name} / ${element.EUR_price} / ${element.orders_counter} ${element.file_link} \n`);
        if (element.id == id){
            element.orders_counter++; 
            fileLink = element.file_link;
            console.log(`Ce produit a été commandé ${element.orders_counter} fois`);
        }
    });

    var bookStr = JSON.stringify(book, null, 2);
    fs.writeFile(file, bookStr, (err) => {
        // affiche le message
        if(err) console.log('error', err);
        console.log(`Commande enregistrée. Voici le chemin de votre fichier : ${fileLink}`);
    });
}

module.exports = {
    orderProductById
}