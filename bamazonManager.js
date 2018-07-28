// set up the required libraries/tools 
var mysql = require("mysql");
// const readline = require('readline');
var inquirer = require('inquirer');


// set up connection to the mysql server 
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "rootroot",
  database: "bamazon_db"
});

// use connection to run functions/program 
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  queryAllItems();
});

var currentInventory = [];
var itemIdArray = [];
var itemNameArray = [];
var itemPriceArray = [];
var purchaseQuantity;
var productId;


// function that fetches & displays all items 
function queryAllItems() {
  connection.query("SELECT * FROM products", function (err, res) {
    currentInventory = res;

    for (var i = 0; i < currentInventory.length; i++) {
      itemIdArray.push(currentInventory[i].item_id);
      itemNameArray.push(currentInventory[i].product_name);
      itemPriceArray.push(currentInventory[i].price);
    }


    console.log("-----------------------------------");

    inquirer.prompt(
    [
        {
            name: "menuChoice",
            type: "input",
            message: "What do you want to do?\n1) View Products for Sale\n2) View Low Inventory\n3) Add to Inventory\n4) Add New Product\n? ",
            validate: function(value) {
                if(isNaN(value) == false) {
                    return true;
                }
                else {
                    return false;
                }
            }
        },
    ]).then(menuInput => 
    {
      if(menuInput.menuChoice == 1) {
        displayExistingInventory();
        setTimeout(queryAllItems, 2000);
      }
      else if(menuInput.menuChoice == 2) {
        displayLowInventory();
        setTimeout(queryAllItems, 2000);
      }
      else if(menuInput.menuChoice == 3) {
        inquirer.prompt(
        [
            {
                name: "addProduct",
                type: "input",
                message: "What's the ID of the product you want to add inventory for?",
                validate: function (value) {
                if (isNaN(value) == false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            {
                name: "howManyUnits",
                type: "input",
                message: "How many units do you want to add?",
                validate: function (value) {
                    if (isNaN(value) == false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
        ]).then(answers => 
        {
            productId = parseInt(answers.addProduct);
            if (itemIdArray.indexOf(productId) > -1){
                purchaseQuantity = answers.howManyUnits;
                
                console.log("Your addition is being processed!");
                updateInventory(productId, -purchaseQuantity);
                setTimeout(queryAllItems, 2000);
            } else {
                console.log("Please enter a valid ID number.");
                setTimeout(queryAllItems, 2000);
            }
        }); //end of answers =>
      } //end of menu choice 3
      else if(menuInput.menuChoice == 4) { 
          console.log("Need input for next item's name/qty/price and an insert");







          inquirer.prompt(
            [
                {
                    name: "addProduct",
                    type: "input",
                    message: "What's the ID of the product you want to add inventory for?",
                    validate: function (value) {
                    if (isNaN(value) == false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                {
                    name: "howManyUnits",
                    type: "input",
                    message: "How many units do you want to add?",
                    validate: function (value) {
                        if (isNaN(value) == false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
            ]).then(answers => 
            {
                productId = parseInt(answers.addProduct);
                if (itemIdArray.indexOf(productId) > -1){
                    purchaseQuantity = answers.howManyUnits;
                    
                    console.log("Your addition is being processed!");
                    updateInventory(productId, -purchaseQuantity);
                    setTimeout(queryAllItems, 2000);
                } else {
                    console.log("Please enter a valid ID number.");
                    setTimeout(queryAllItems, 2000);
                }
            }); //end of answers =>










      }
    }); //end of prompt for which menu choice
  }); //end of connection query
} //end of query all items

//updateInventory should take an ID and QTY and update the database (but not display any price/total/etc)
//great bay activity update item in a database update query!
function updateInventory(updateWhatId, updateWhatQty) {
  var index = itemIdArray.indexOf(updateWhatId);
  currentInventory[index].stock_quantity -= updateWhatQty;
  var query = "UPDATE products SET stock_quantity=stock_quantity-" + updateWhatQty + " WHERE item_id=" + updateWhatId + ";";
  //console.log(query);
  connection.query(query);  


  displayInventory();
  var updatedName = itemNameArray[index];
  var updatedPrice = itemPriceArray[index];
  console.log("You added " + (-updateWhatQty) + " of ID#" + updateWhatId + ": " + updatedName + " at $" + updatedPrice + " each");
  console.log("Total expected sales: $" + updatedPrice*(-updateWhatQty) );
}

// display all inventory items
function displayInventory() {
  for (var i = 0; i < currentInventory.length; i++) {
    console.log(currentInventory[i].item_id + " | " + currentInventory[i].product_name + " | " + currentInventory[i].department_name + " | " + currentInventory[i].price + " | " + currentInventory[i].stock_quantity);
  }
}

// display extant inventory items
function displayExistingInventory() {
    for (var i = 0; i < currentInventory.length; i++) {
        if(currentInventory[i].stock_quantity > 0) {
            console.log(currentInventory[i].item_id + " | " + currentInventory[i].product_name + " | " + currentInventory[i].department_name + " | " + currentInventory[i].price + " | " + currentInventory[i].stock_quantity);
        }
    }
}


// display low inventory items
function displayLowInventory() {
    for (var i = 0; i < currentInventory.length; i++) {
        if(currentInventory[i].stock_quantity < 3) {
            console.log(currentInventory[i].item_id + " | " + currentInventory[i].product_name + " | " + currentInventory[i].department_name + " | " + currentInventory[i].price + " | " + currentInventory[i].stock_quantity);
        }
    }
}
  