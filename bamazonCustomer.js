var mysql = require("mysql");
var inquirer = require("inquirer");
var columnify = require('columnify')

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    welcomeShopper();
    showProducts();
});

//Show a welcome message to the shopper 
function welcomeShopper() {
    console.log("---------------------------------------\n\nWelcome to Candyzon!!\n\n---------------------------------------")
    console.log("\n\nPlease enjoy our great selection \n\n---------------------------------------")
}
//Show the user all the items available for sale
function showProducts() {
    connection.query("SELECT item_id, product_name, price FROM products", function (err, results) {
        if (err) throw err;
        console.log(columnify(results));
        makeSelection();
    });
}

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
            message: "How much would you like?"
        }])
        .then(function (answer) {
            var query = "SELECT * FROM products WHERE ?";
            connection.query(query, { item_id: answer.item }, function (err, res) {
                if (err) throw err;

                //Make sure it is a valid selection
                if (res.length === 0) {
                    console.log("---------------------------------------\n\nOops, that item doesn't exist.  Please try again.\n\n---------------------------------------")
                    showProducts();
                }

                //Make sure the desired quantity exists and place the order
                else if (parseInt(answer.quantity) <= res[0].stock_quantity) {
                    console.log("Sold")
                    placeOrder();
                }

                //Show an error message and ask if they want to buy something else
                else {
                    console.log("We are so sorry but our stock is too low.");
                    showProducts(); //TODO prompt if they want to proceed or be done
                }
            });
        });
}

function placeOrder() {
    console.log("order is being placed...")
    connection.end();
    //TODO decrease inventory and print out receipt and ask if they are done shopping
}
