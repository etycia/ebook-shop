// Module 1

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    name: String
});

var orderModel = mongoose.model('order', orderSchema);


// Module 2

//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;

var order = new orderModel({
    orderDate: Date,
    EUR_amount : Number,
    ebook:[
      {type: Schema.Types.ObjectId, ref: 'ebooks'}
    ],
    user:[
      {type: Schema.Types.ObjectId, ref: 'users'}
});





async function addOrder (productId, userId, EUR_amount){

    var o = new order();

    o.orderDate = '2019-11-28';
    o.ebook.push(productId);
    o.user.push(userId);

    o.save();
}

async function getUserOrders(userId){
    var userOrder = new order.find({user : userId});
    
}
async function getUserProducts(orderId){
    var userProductsIdFromOrder = new order.find({_id : orderId });
    // Todo find array of id?
    var productOfOrder = new ebook.find();
    // foreach + Tableau ?
}


module.exports = 
