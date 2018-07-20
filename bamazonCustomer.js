/* set up the required libraries/tools */
var mysql = require("mysql");
const readline = require('readline');

/* setup the input reader */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


/* set up connection to the mysql server */
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

/* function that fetches & displays all items */
function queryAllItems() {
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity );
    }
    console.log("-----------------------------------");
  });
}

/* use connection to run functions/program */
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  
  queryAllItems();
  rl.pause();
  
  /* ask the user what they want to buy */
  rl.question('What do you want to buy? ', (item_id) => {
    // TODO: Log the answer in a database
    console.log(`Thank you for your valuable feedback: ${item_id}`);
     /* ask the user how many units */
    rl.question('How many do you want to buy? ', (item_qty) => {
      // TODO: Log the answer in a database
      console.log(`Thank you for your valuable feedback: ${item_qty}`);
      rl.close();
    });
  });

  console.log("wocka wocka wocka");

});




