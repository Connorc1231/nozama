const mysql = require('mysql');
const connection = require('../database/connection.js');
const csv = require('./csvWriter.js');

const writeData = (n) => {
  const data = new csv(n);
  data.writeUsers();
  data.writeUserDetails();
  data.writeUserOrders();
  data.writeUserWishlist();  
}

const readUserData = () => {
  try { 
    let query = `LOAD DATA LOCAL INFILE './users.csv' INTO TABLE nozama.users FIELDS TERMINATED BY ',';`;
    let data = connection.queryAsync(query); 
  } catch(error) {console.log(error)}
}

const readUserDetailsData = () => {
  try { 
    let query = "LOAD DATA LOCAL INFILE '/Users/Connor_Chen/Documents/Git/nozama/user/data/userDetails.csv' INTO TABLE user_details FIELDS TERMINATED BY ',';";
    let data = connection.queryAsync(query); 
  } catch(error) {console.log(error)}
}

const readUserOrdersData = () => {
  try { 
    let query = "LOAD DATA LOCAL INFILE '/Users/Connor_Chen/Documents/Git/nozama/user/data/userOrders.csv' INTO TABLE user_orders FIELDS TERMINATED BY ',';";
    let data = connection.queryAsync(query); 
  } catch(error) {console.log(error)}
}

const readUserWishlistData = () => {
  try { 
    let query = "LOAD DATA LOCAL INFILE '/Users/Connor_Chen/Documents/Git/nozama/user/data/userWishlist.csv' INTO TABLE user_wishlist FIELDS TERMINATED BY ',';";
    let data = connection.queryAsync(query); 
  } catch(error) {console.log(error)}
}

// Uncomment below if you know what youre doing...
// writeData(500001);
// readUserData();
// readUserDetailsData();
// readUserOrdersData();
// readUserWishlistData();
