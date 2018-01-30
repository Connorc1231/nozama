const mysql = require('mysql');
const path = require('path');
const fs = require('fs');
const getFakeUser = require('../data/userData.js');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nozama'
})

const postUser = users => {
  let query = `INSERT INTO users (name, email, password) VALUES`;
  users.map(user => {
    connection.query(`SELECT * FROM users WHERE name = "${user.username}"`, (err, data) => {
      if (data.length) {
        return 'User already exists!';
      } else {
        query += `("${user.username}", "${user.email}", "${user.password}"), `;
      }
      postQuery(query)
    })
  })
  const postQuery = query => {
    query = query.substring(0, query.length - 2);
    connection.query(query);
  }
}

const postUserDetails = users => {
  let query = `INSERT INTO user_details (user_id, zip, state, gender, age, subscription_type) VALUES`;
  users.map(user => {
    query += `((SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1), "${user.zip}","${user.state}", "${user.gender}", "${user.age}", "${user.subscription}"), `;
  })
  query = query.substring(0, query.length - 2);
  connection.query(query);
}

const postUserOrders = users => {
  let query = `INSERT INTO user_orders (user_id, product_id, order_placed_at, price) VALUES`;
  users.map(user => {
    user.orders.map(order => {
      query += `((SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1), "${order.product_id}", "${order.order_placed_at}", "${order.price}"), `;  
    })
  })
  query = query.substring(0, query.length - 2);
  connection.query(query);
}

const postUserSocialMedia = users => {
  let query = `INSERT INTO user_social_media (user_id, facebook_url, twitter_url, instagram_url) VALUES`;
  users.map(user => {
    query += `((SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1), "${user.social_media.facebook_url}","${user.social_media.twitter_url}", "${user.social_media.instagram_url}"), `;
  })
  query = query.substring(0, query.length - 2);
  connection.query(query);
}

// To add existing fake data items into db
const postUserWishlist = users => {
  let query = `INSERT INTO user_wishlist (user_id, product_id, created_at, related_items) VALUES`;
  users.map(user => {
    user.wishlist.map(item => {
      query += `((SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1), "${item.product_id}", "${item.created_at}", "Related Items Here"), `;  
    })
  })
  query = query.substring(0, query.length - 2);
  connection.query(query)
}

const loginUser = user => 
  new Promise((resolve, reject) => 
    connection.query('SELECT * FROM users WHERE name=?', [user.username], (err, data) => {
      if (err) { reject(err) }
      else { 
        if (data[0].password === user.password) { resolve(data[0]) } 
        else { reject(err) }
      }
    })
  )

const getUser = user_id => {
  let userInfo = {};
  new Promise((resolve, reject) => 
    connection.query('SELECT * FROM users WHERE user_id=?', [user_id], (err, data) => {
      if (err) { reject(err) }
      else { resolve(data) }
    })
  )
}

// To add single items to user's wishlist
const addToWishlist = (item, user_id) => 
  new Promise((resolve, reject) => 
    connection.query(`INSERT INTO user_wishlist (user_id, product_id, created_at, related_items) VALUES (?, ?, ?, ?)`, [user_id, item.product_id, item.createdAt, item.related_items], (err, data) => {
      if (err) { reject(err) }
      else { resolve(data) }
    })
  )

const getWishlist = user_id => 
  new Promise((resolve, reject) => 
    connection.query(`SELECT * FROM user_wishlist WHERE user_id = ?`, [user_id], (err, data) => {
      if (err) { reject(err) }
      else { resolve(data) }
    })
  )

const getOrders = user_id => 
  new Promise((resolve, reject) =>
    connection.query(`SELECT * FROM user_orders WHERE user_id = ?`, [user_id], (err, data) => {
      if (err) { reject(err) }
      else { resolve(data) }
    })
  )

const getAnalytics = user_id => {
  // Analytics
}

// --------------------------- FAKE DATA GENERATOR -------------------------------//

const batchRequest = (n) => {
  for (let i = 0; i < n; i += 1000) {
    let batch = [];
    for (let j = i; j < i + 1000; j++) {
      batch.push(getFakeUser())
    }
    postUser(batch)
  }
}

//set nubmer of fake users
// let numberToCreate = 1000000;
// console.time(`Time took to create ${numberToCreate} users`);
// batchRequest(numberToCreate);
// console.timeEnd(`Time took to create ${numberToCreate} users`);

module.exports = {
  postUser,
  postUserDetails,
  postUserOrders,
  postUserSocialMedia,
  postUserWishlist,
  loginUser,
  getUser,
  addToWishlist,
  getWishlist,
  getOrders, 
  getAnalytics,
  batchRequest
}