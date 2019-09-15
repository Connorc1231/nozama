const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fakerGenerator = require('./fakerGenerator.js');

class csv {
  constructor(props) {
    this.allUsers = {};
    this.n = props;
    this.usersWriter = createCsvWriter({
      path: './users.csv',
      header: ['user_id', 'name', 'email', 'password'],
    });
    this.userDetailsWriter = createCsvWriter({
      path: './userDetails.csv',
      header: ['user_details_id', 'user_id', 'state', 'gender', 'age'],
    });
    this.userOrdersWriter = createCsvWriter({
      path: './userOrders.csv',
      header: ['order_id', 'user_id', 'product_id', 'order_placed_at', 'price'],
    });
    this.userWishlistWriter = createCsvWriter({
      path: './userWishlist.csv',
      header: ['user_wishlist_id', 'user_id', 'product_id', 'created_at', 'related_items'],
    });

    this.init();
  }

  init() {
    this.allUsers = new fakerGenerator(this.n);
    this.allUsers.format();
  }

  writeUsers() {
    this.usersWriter.writeRecords(this.allUsers.data.users)
      .then(() => console.log('...users Done'));
  }

  writeUserDetails() {
    this.userDetailsWriter.writeRecords(this.allUsers.data.userDetails)
      .then(() => console.log('...userDetails Done'));
  }

  writeUserOrders() {
    this.userOrdersWriter.writeRecords(this.allUsers.data.userOrders)
      .then(() => console.log('...userOrders Done'));
  }

  writeUserWishlist() {
    this.userWishlistWriter.writeRecords(this.allUsers.data.userWishlist)
      .then(() => console.log('...userWishlist Done'));
  }
}

module.exports = csv;
