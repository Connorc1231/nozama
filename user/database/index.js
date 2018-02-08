const mysql = require('mysql');
const connection = require('./connection.js');

// ---------------------------------------- Functions to populate tables ---------------------------------------- //

const postUser = user => {
  let query = `INSERT INTO users (name, email, password) VALUES`;
  return connection.queryAsync(`SELECT name FROM users WHERE name = "${user.username}"`)
    .then(data => {
      if (data.length) {
        Promise.reject(false);
      } else {
        query += `("${user.username}", "${user.email}", "${user.password}"), `;
      }
    })
    .then(data => connection.queryAsync(query.substring(0, query.length - 2)))
    .then(data => connection.queryAsync('(SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1)')
      .then(data => data[0].user_id)
    )
    .catch(error => 'User already exists!');
}

const postUserDetails = users => {
  let query = `INSERT INTO user_details (user_id, state, gender, age) VALUES `;
  return Promise.all(users.map(user => {
    query += `(
      "${user.id}", 
      "${user.state}", 
      "${user.gender}", 
      "${user.age}"
    ), `;
  }))
  .then(connection.queryAsync(query.substring(0, query.length - 2))
    .then(data => data)
  )
  .catch(error => error)
}

const postUserOrders = users => {
    console.log('b')
  let query = `INSERT INTO user_orders (user_id, product_id, order_placed_at, price) VALUES `;
  return Promise.all(users.map(user => {
    user.orders.map(order => {
      query += `(
        "${user.id}",  
        "${order.product_id}", 
        "${order.order_placed_at}", 
        "${order.price}"), `;  
    })
  }))
  .then(data => connection.queryAsync(query.substring(0, query.length - 2))
    .then(data => data)
  )
  .catch(error => error);
}

const postUserWishlist = users => {
    console.log('c')
  let query = `INSERT INTO user_wishlist (user_id, product_id, created_at, related_items) VALUES `;
  return Promise.all(users.map(user => {
    user.wishlist.map(item => {
      query += `(
        "${user.id}", 
        "${item.product_id}", 
        "${item.created_at}", 
        "Related Items Here"), `;
    })
  }))
  .then(data => connection.queryAsync(query.substring(0, query.length - 2))
    .then(data => data)
  )
  .catch(error => error);
}

// ---------------------------------------------------------------------------------------------------- //

const loginUser = user => 
  new Promise((resolve, reject) => 
    connection.query('SELECT password FROM users WHERE name=?', [user.username], (err, data) => {
      if (err) { reject(err) }
      else { 
        if (data[0] && data[0].password === user.password) { resolve(data[0]) } 
        else { reject(err) }
      }
    })
  ).catch(error => error);

// To add single items to user's wishlist
const addToWishlist = (item, user_id) => 
  connection.queryAsync(
    `INSERT INTO user_wishlist (user_id, product_id, created_at, related_items) 
    VALUES (?, ?, ?, ?)`, 
    [user_id, item.product_id, item.created_at, item.related_items]
  )
    .then(data => data)
    .catch(error => error);

// To place record a placed order
const addOrder = (item, user_id) => 
  connection.queryAsync(
    `INSERT INTO user_orders (user_id, product_id, order_placed_at, price) 
    VALUES (?, ?, ?, ?)`, 
    [user_id, item.product_id, item.order_placed_at, item.price]
  )
    .then(data => data)
    .catch(error => error);

// ------------------------ Functions to build / export full user object ------------------------ //

const getUserObject = user_id => {
  let userInfo = {};
  const ops = [
    getUser(user_id),
    getUserDetails(user_id),
    getOrders(user_id),
    getWishlist(user_id),
  ];

  return Promise.all(ops)
    .then(results => {
    userInfo = {
      "id": user_id,
      "username" : results[0].name,
      "email" : results[0].email,
      "gender" : results[1].gender,
      "age" : results[1].age,
      "state" : results[1].state,
      "orders" : [],
      "wishlist" : []
    }
    results[2].map(order => { userInfo.orders.push({ "product_id": order.product_id }) })
    results[3].map(wish => { userInfo.wishlist.push({ "product_id": wish.product_id }) })
    return userInfo
  }).catch(error => error);
}

const getUser = user_id => 
    connection.queryAsync(`SELECT * FROM users WHERE user_id = ?`, [user_id])
      .then(data => data[0])

const getUserDetails = user_id => 
    connection.queryAsync(`SELECT * FROM user_details WHERE user_id = ?`, [user_id])
      .then(data => data[0])

const getWishlist = user_id => 
    connection.queryAsync(`SELECT * FROM user_wishlist WHERE user_id = ?`, [user_id])
      .then(data => data)

const getOrders = user_id => 
    connection.queryAsync(`SELECT * FROM user_orders WHERE user_id = ?`, [user_id])
      .then(data => data)

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
  getUserObject
}