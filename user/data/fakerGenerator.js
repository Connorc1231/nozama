const getFakeUser = require('./faker.js')

class fakerGenerator {
  constructor(props) {
    this.batchSize = props;
    this.batch = [];
    this.data = {
      users: [],
      userDetails: [],
      userOrders: [],
      userWishlist: [],
    }

    this.init()
  }

  init(props) {
    for (let i = 1; i < this.batchSize; i++) {
      let user = getFakeUser();
      user.id = i;
      this.batch.push(user);
    }
  }

  format() {
    this.batch.map(user => {
      this.formatUsers(user);
      this.formatUserDetails(user);
      this.formatUserOrders(user);
      this.formatUserWishlist(user);
    })
  }

  formatUsers(user) {
    let usersObj = {};
    usersObj['name'] = user.username;
    usersObj['email'] = user.email;
    usersObj['password'] = user.password;

    this.data.users.push(usersObj);
  }

  formatUserDetails(user) {
    let userDetailsObj = {};

    userDetailsObj['user_id'] = user.id;
    userDetailsObj['state'] = user.state;
    userDetailsObj['gender'] = user.gender;
    userDetailsObj['age'] = user.age;

    this.data.userDetails.push(userDetailsObj);
  }

  formatUserOrders(user) {
    user.orders.map(order => {
      let userOrdersObj = {};

      userOrdersObj['user_id'] = user.id;
      userOrdersObj['product_id'] = order.product_id;
      userOrdersObj['order_placed_at'] = order.order_placed_at;
      userOrdersObj['price'] = order.price;

      this.data.userOrders.push(userOrdersObj);
    })    
  }

  formatUserWishlist(user) {
    user.wishlist.map(item => {
      let userWishlistObj = {};

      userWishlistObj['user_id'] = user.id;
      userWishlistObj['product_id'] = item.product_id;
      userWishlistObj['created_at'] = item.created_at;
      userWishlistObj['price'] = item.price;

      this.data.userWishlist.push(userWishlistObj);
    })  
  }
}

module.exports = fakerGenerator
