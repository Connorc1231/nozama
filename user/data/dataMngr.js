const connection = require('../database/connection.js');
const csv = require('./csvWriter.js');

const writeData = (n) => {
  const data = new csv(n);
  data.writeUsers();
  data.writeUserDetails();
  data.writeUserOrders();
  data.writeUserWishlist();
};

const readUserData = () => {
  try {
    const query = 'LOAD DATA LOCAL INFILE "./users.csv" INTO TABLE nozama.users FIELDS TERMINATED BY ",";';
    const data = connection.queryAsync(query);
  } catch (err) {
    return err;
  }
};

const readUserDetailsData = () => {
  try {
    const query = "LOAD DATA LOCAL INFILE '/Users/Connor_Chen/Documents/Git/nozama/user/data/userDetails.csv' INTO TABLE user_details FIELDS TERMINATED BY ',';";
    const data = connection.queryAsync(query);
  } catch (err) {
    return err;
  }
};

const readUserOrdersData = () => {
  try {
    const query = "LOAD DATA LOCAL INFILE '/Users/Connor_Chen/Documents/Git/nozama/user/data/userOrders.csv' INTO TABLE user_orders FIELDS TERMINATED BY ',';";
    const data = connection.queryAsync(query);
  } catch(err) {
    return err;
  }
};

const readUserWishlistData = () => {
  try {
    const query = "LOAD DATA LOCAL INFILE '/Users/Connor_Chen/Documents/Git/nozama/user/data/userWishlist.csv' INTO TABLE user_wishlist FIELDS TERMINATED BY ',';";
    const data = connection.queryAsync(query);
  } catch (err) {
    return err;
  }
};

// Uncomment below if you know what youre doing...
// writeData(500001);
// readUserData();
// readUserDetailsData();
// readUserOrdersData();
// readUserWishlistData();
