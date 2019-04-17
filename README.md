# bamazon-node-mysql-app
CLI App using MySQL 

# Project Overview
This project is a command line node app with a MySQL database.  There are two interfaces - one for shoppers and one for managers.  

Shoppers are able to view the products for sale and make a purchase for their desired item and quantity.  When an order is placed, the inventory is updated to reflect the sale and the order total is displayed to the shopper.  

Managers are able to do the following tasks: 
* View products for sale
* View products that have a low inventory
* Add a new product to the catalog
* Update the inventory for an existing product

The app utilizes mysql, inquirer, and columnify npm packages. 

[Click to watch the demo](https://drive.google.com/file/d/15fXg1vAQaKcijAyd6dmPpdWRslDjmha3/view)