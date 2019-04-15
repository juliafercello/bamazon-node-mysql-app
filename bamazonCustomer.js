var mysql = require("mysql");
var inquirer = require("inquirer");
var columnify = require('columnify')

//DB Connection Info
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

//Connect to the database and call functions to welcome shopper and show products for sale
connection.connect(function (err) {
    if (err) throw err;
    welcomeShopper();
    showProducts();
});

//Show a welcome message to the shopper 
function welcomeShopper() {
    console.log("---------------------------------------\n\n\tWelcome to Candyzon!!\n\n---------------------------------------")
    console.log("\n\n   Please enjoy our great selection \n\n---------------------------------------")
}

//Show the user all the items available for sale
function showProducts() {
    connection.query("SELECT item_id, product_name, format(price,2) as price FROM products", function (err, results) {
        if (err) throw err;
        console.log("\n"+ columnify(results) + "\n");
        makeSelection();
    });
}

//Prompt user to make selection and process their request
function makeSelection() {
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "Which item would you like to buy?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many units would you like to buy?"
        }])
        .then(function (answer) {
            var query = "SELECT * FROM products WHERE ?";
            connection.query(query, { item_id: answer.item }, function (err, res) {
                if (err) throw err;

                //Make sure it is a valid selection
                if (res.length === 0) {
                    console.log("---------------------------------------\n\n   Oops, that item doesn't exist.\n\n---------------------------------------")
                    continueShopping();
                }

                //Make sure the desired quantity exists and place the order
                else if (parseInt(answer.quantity) <= res[0].stock_quantity) {
                    var product = answer.item;
                    var purchaseQty = parseInt(answer.quantity);
                    var stockQty = res[0].stock_quantity;
                    var price = res[0].price;
                    placeOrder(product, purchaseQty, stockQty, price);
                }

                //Show an error message and ask if they want to buy something else
                else {
                    console.log("---------------------------------------\n\nOops, we don't have that many units available.\n\n---------------------------------------")
                    continueShopping();
                }
            });
        });
}

function placeOrder(product, purchaseQty, stockQty, price) {
    var newStockQty = stockQty - purchaseQty;
    var orderTotal = price * purchaseQty;

    var updateStock = "UPDATE products SET stock_quantity = " + newStockQty + " WHERE item_id = " + product;

    connection.query(updateStock, function (err, res) {
        if (err) throw err;

        console.log("---------------------------------------\n\n\tThanks for your purchase!!\n\n---------------------------------------")
        console.log("\n\n\tTotal Due: $" + orderTotal.toFixed(2) + "\n\n---------------------------------------")
        continueShopping();
    });
}

function continueShopping() {
    inquirer.prompt({
        name: "keepShopping",
        type: "confirm",
        message: "Would you like to continue shopping?"
    })
        .then(function (answer) {
            if (answer.keepShopping) {
                showProducts();
            }
            else {
                connection.end();
            }
        });
}
