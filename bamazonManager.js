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

//Connect to the database and call a function to display manager options.
connection.connect(function (err) {
    if (err) throw err;
    welcomeManager();
    displayMgrMenu();
});

//Show a welcome message to the shopper 
function welcomeManager() {
    console.log("---------------------------------------\n\n\tCandyzon Manager\n\n---------------------------------------")
    console.log("\n\nManage product selection and inventory\n\n---------------------------------------")
}

function displayMgrMenu() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    viewProducts();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addProduct();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}

//Display all products
function viewProducts() {
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
    connection.query(query, function (err, results) {
        if (err) throw err;
        console.log(columnify(results));
        displayMgrMenu();
    });
}


//TODO When no results show nice message
function viewLowInventory() {
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, results) {
        if (err) throw err;
        console.log(columnify(results));
        displayMgrMenu();
    });
}

//Increase stock quantity for selected product
function addInventory() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "item",
                    type: "list",
                    choices: function () {
                        var items = [];
                        for (var i = 0; i < results.length; i++) {
                            var idName = results[i].item_id + " - " + results[i].product_name;
                            items.push(idName);
                        }
                        return items;
                    },
                    message: "To add inventory, select the applicable product."
                },
                {
                    name: "newQuantity",
                    type: "input",
                    message: "Please input the total available inventory.?"
                }
            ])
            .then(function (answer) {
                // var product;
                console.log(answer);
                //         var updateStock = "UPDATE products SET stock_quantity = " + newStockQty + " WHERE item_id = " + product;
                //         connection.query(updateStock, function (err, res) {
                //             if (err) throw err;
                //         }
                //     });
                // }

            });
    }); 
}

