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

//Show a welcome message to the manager 
function welcomeManager() {
    console.log("---------------------------------------\n\n\tToy-azon Manager\n\n---------------------------------------")
    console.log("\n\nManage the product selection and inventory\n\n---------------------------------------")
}

//Allow user to indicate their action and bring them to the appropriate function
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
                    updateInventory();
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
    console.log("---------------------------------------\n\nHere are the products for sale: \n")
    var query = "SELECT item_id, product_name, format(price,2) as price, stock_quantity FROM products";
    connection.query(query, function (err, results) {
        if (err) throw err;
        console.log(columnify(results) + "\n");
        displayMgrMenu();
    });
}


//Show products with inventory less than 5.
function viewLowInventory() {
    var query = "SELECT item_id, product_name, format(price,2) as price, stock_quantity FROM products WHERE stock_quantity < 5";

    connection.query(query, function (err, results) {
        if (err) throw err;

        if (results.length > 0) {
            console.log("---------------------------------------\n\nThe following products have low inventory:\n")
            console.log(columnify(results) + "\n");
        }
        else {
            console.log("---------------------------------------\n\nThere are no products with low inventory.\n\n---------------------------------------")

        }
        displayMgrMenu();
    });
}

//Update stock quantity for selected product
function updateInventory() {
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
                    message: "To update inventory, select the applicable product."
                },
                {
                    name: "newQuantity",
                    type: "input",
                    message: "Please input the total available inventory.",
                    validate: function (value) {
                        if (!isNaN(value)) {
                            return true;
                        }
                        else {
                        return "Oops, the inventory needs to be a number";
                        }
                    }
                }
            ])
            .then(function (answer) {
                //get the item id for the selected product
                var productInfo = answer.item.split(" ");
                var itemId = parseInt(productInfo[0]);
                var newStockQty = answer.newQuantity;

                var updateStock = "UPDATE products SET stock_quantity = " + newStockQty + " WHERE item_id = " + itemId;
                connection.query(updateStock, function (err, results) {
                    if (err) throw err;
                    console.log("---------------------------------------\n\nInventory successfully updated.\n\n---------------------------------------")
                    displayMgrMenu();
                });
            });
    });
}

function addProduct() {
    inquirer
        .prompt([
            {
                name: "productName",
                type: "input",
                message: "What is the name of the new product?"
            },
            {
                name: "department",
                type: "rawlist",
                message: "What is the department?",
                choices: [
                    "Candy",
                    "Toys",
                    "Games"
                ]
            },
            {
                name: "price",
                type: "input",
                message: "What is the price per unit?",
                validate: function (value) {
                    if (!isNaN(value)) {
                        return true;
                    }
                    else {
                        return "Oops, please provide a valid price.";
                    }
                }
            },
            {
                name: "stock",
                type: "input",
                message: "How many units are available?",
                validate: function (value) {
                    if (!isNaN(value)) {
                        return true;
                    }
                    else {
                        return "Oops, the inventory needs to be a number";
                    }
                }
            }
        ])
        .then(function (answer) {
            var query = "INSERT INTO products SET ?"
            connection.query(query,
                {
                    product_name: answer.productName,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.stock
                },
                function (err, results) {
                    if (err) throw err;
                    console.log("---------------------------------------\n\nProduct successfully created.\n\n---------------------------------------")
                    displayMgrMenu();
                }
            );
        });
}
