const connection = require('./connection.js');

// ------------------------------ Functions to populate tables ------------------------------ //

const postUser = async (user) => {
  try {
    let query = 'INSERT INTO users (name, email, password) VALUES';
    const data = await connection.queryAsync(`SELECT name FROM users WHERE name = '${user.username}'`);
    if (data.length) {
      Promise.reject();
    } else {
      query += `('${user.username}', '${user.email}', '${user.password}'), `;
    }
    await connection.queryAsync(query.substring(0, query.length - 2));
    const userData = await connection.queryAsync('(SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1)');
    return userData[0].user_id;
  } catch (err) {
    return err;
  }
};

const postUserDetails = async (users) => {
  try {
    let query = 'INSERT INTO user_details (user_id, state, gender, age) VALUES ';
    await Promise.all(users.map((user) => {
      query += `(
        "${user.id}", 
        "${user.state}", 
        "${user.gender}", 
        "${user.age}"
      ), `;
    }));
    const data = await connection.queryAsync(query.substring(0, query.length - 2));
    return data;
  } catch (err) {
    return err;
  }
};

const postUserOrders = async (users) => {
  try {
    let query = 'INSERT INTO user_orders (user_id, product_id, order_placed_at, price) VALUES ';
    await Promise.all(users.map((user) => {
      user.orders.map((order) => {
        query += `(
          "${user.id}",  
          "${order.product_id}", 
          "${order.order_placed_at}", 
          "${order.price}"), `;
      });
    }));
    const data = await connection.queryAsync(query.substring(0, query.length - 2));
    return data;
  } catch (err) {
    return err;
  }
};

const postUserWishlist = async (users) => {
  try {
    let query = 'INSERT INTO user_wishlist (user_id, product_id, created_at, related_items) VALUES ';
    await Promise.all(users.map((user) => {
      user.wishlist.map((item) => {
        query += `(
          "${user.id}", 
          "${item.product_id}", 
          "${item.created_at}", 
          "Related Items Here"), `;
      });
    }));
    const data = await connection.queryAsync(query.substring(0, query.length - 2));
    return data;
  } catch (err) {
    return err;
  }
};

// --------------------------------------------------------------------------------------------- //

const loginUser = async (user) => {
  try {
    const data = await connection.queryAsync('SELECT password FROM users WHERE name=?', [user.username]);
    if (data[0] && data[0].password === user.password) {
      return true;
    }
    throw (false);
  } catch (err) {
    return err;
  }
};

// To place record a placed order
const addOrder = async (item, user_id) => {
  try {
    const data = await connection.queryAsync(
      `INSERT INTO user_orders (user_id, product_id, order_placed_at, price) 
      VALUES (?, ?, ?, ?)`,
      [user_id, item.product_id, item.order_placed_at, item.price],
    );
    return data;
  } catch (err) {
    return err;
  }
};

// To add single items to user's wishlist
const addToWishlist = async (item, user_id) => {
  try {
    const data = await connection.queryAsync(
      `INSERT INTO user_wishlist (user_id, product_id, created_at, related_items) 
      VALUES (?, ?, ?, ?)`,
      [user_id, item.product_id, item.created_at, item.related_items],
    );
    return data;
  } catch (err) {
    return err;
  }
};

// ------------------------ Functions to build / export full user object ------------------------ //

const getUser = (user_id) =>
  (connection.queryAsync('SELECT * FROM users WHERE user_id = ?', [user_id]))[0];

const getUserDetails = (user_id) =>
  (connection.queryAsync('SELECT * FROM user_details WHERE user_id = ?', [user_id]))[0];

const getWishlist = (user_id) =>
  connection.queryAsync('SELECT * FROM user_wishlist WHERE user_id = ?', [user_id]);

const getOrders = (user_id) =>
  connection.queryAsync('SELECT * FROM user_orders WHERE user_id = ?', [user_id]);

const getUserObject = async (user_id) => {
  try {
    const listData = await Promise.all([getOrders(user_id), getWishlist(user_id)]);

    const userData = (await connection.queryAsync(
      'SELECT * FROM users INNER JOIN user_details ON users.user_id = user_details.user_id WHERE users.user_id=?', 
      [user_id]))[0];

    const userInfo = {
      id: userData.user_id || user_id,
      username: userData.name,
      email: userData.email,
      state: userData.state,
      gender: userData.gender,
      age: userData.age,
      orders: [],
      wishlist: [],
    };

    listData[0].map((order) => {
      userInfo.orders.push({
        product_id: order.product_id,
      });
    });
    listData[1].map((wish) => {
      userInfo.wishlist.push({
        product_id: wish.product_id,
      });
    });
    return userInfo;
  } catch (err) {
    return err;
  }
};

module.exports = {
  connection,
  postUser,
  postUserDetails,
  postUserOrders,
  postUserWishlist,
  loginUser,
  addOrder,
  getOrders,
  addToWishlist,
  getWishlist,
  getUserObject,
};
