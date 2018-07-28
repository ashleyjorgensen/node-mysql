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
    displayInventory();


    console.log("-----------------------------------");
    inquirer.prompt([
      {
        name: "buyProduct",
        type: "input",
        message: "What's the ID of the product you want to buy?",
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
        message: "How many units do you want to buy?",
        validate: function (value) {
          if (isNaN(value) == false) {
            return true;
          } else {
            return false;
          }
        }
      },
    ]).then(answers => {
      productId = parseInt(answers.buyProduct);
      if (itemIdArray.indexOf(productId) > -1){
        purchaseQuantity = answers.howManyUnits;
        
        if(checkInventory(productId, purchaseQuantity) == true)
        {
          console.log("Your order is being processed!");
          updateInventory(productId, purchaseQuantity);
          process.exit();
        }
        else{
          console.log("Not enough quantity");
        }


      } else {
        console.log("Please enter a valid ID number.");
        setTimeout(queryAllItems, 2000);
      }
    });
  });
}

// checkInventory should take in parameters ID and QTY and return true/false depending if there's enough qty
function checkInventory() {
  //console.log(currentInventory);
  // 
  //console.log(currentInventory[itemIdArray.indexOf(productId)].stock_quantity);
  var selectedItemInventory = currentInventory[itemIdArray.indexOf(productId)].stock_quantity;

  if (purchaseQuantity <= selectedItemInventory) {
    //call and update inventory function that we need to create 
    // updateInventory(productId, purchaseQuantity)
    return true;
    
    //subtract purcahse quantity 
    //then you will pass that information into the new amount and pass that into the update quantity. 
  }
  else {
    //if we cannot fulfill the order console log please select another item
    console.log("Unable to process; quantity insufficient. Please try again.");
    //then call queryAllItems function again
    queryAllItems();
    return false;
  }
}

//updateInventory should take an ID and QTY and update the database (but not display any price/total/etc)
function updateInventory(updateWhatId, updateWhatQty) {
  var index = itemIdArray.indexOf(updateWhatId);
  currentInventory[index].stock_quantity -= updateWhatQty;
  var query = "UPDATE products SET stock_quantity=stock_quantity-" + updateWhatQty + " WHERE item_id=" + updateWhatId + ";";
  //console.log(query);
  connection.query(query);  


  displayInventory();
  var updatedName = itemNameArray[index];
  var updatedPrice = itemPriceArray[index];
  console.log("You bought " + updateWhatQty + " of ID#" + updateWhatId + ": " + updatedName + " at $" + updatedPrice + " each");
  console.log("Total: $" + updatedPrice*updateWhatQty);
}

// display all inventory items
function displayInventory() {
  for (var i = 0; i < currentInventory.length; i++) {
    console.log(currentInventory[i].item_id + " | " + currentInventory[i].product_name + " | " + currentInventory[i].department_name + " | " + currentInventory[i].price + " | " + currentInventory[i].stock_quantity);
  }
}

  





