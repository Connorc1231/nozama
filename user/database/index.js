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

connection.queryAsync = function queryAsync(...args) {
  return new Promise((resolve, reject) => {
    this.query(...args, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
};

const postUser = users => {
  let query = `INSERT INTO users (name, email, password) VALUES`;
  return Promise.all(users.map(user => {
    return connection.queryAsync(`SELECT * FROM users WHERE name = "${user.username}"`)
      .then(data => {
        if (data.length) {
          console.log('User already exists!');
          return false;
        } else {
          query += `("${user.username}", "${user.email}", "${user.password}"), `;
        }
      })
  }))
    .then(data => connection.queryAsync(query.substring(0, query.length - 2))
      .then(data => data)
    )
    .catch(error => error);
}


const postUserDetails = users => {
  return Promise.all(users.map(user => {
    user.zip = user.zip.slice(0, 5)
      let query = `INSERT INTO user_details (user_id, zip, state, gender, age, subscription_type) VALUES (
        (SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1), 
        "${user.zip}",
        "${user.state}", 
        "${user.gender}", 
        "${user.age}", 
        "${user.subscription}"
      )`;
    return connection.queryAsync(query).then(data => data);
  }))
  
}

const postUserOrders = users => {
  let query = `INSERT INTO user_orders (user_id, product_id, order_placed_at, price) VALUES `;
  return Promise.all(users.map(user => {
    user.orders.map(order => {
      query += `((SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1), "${order.product_id}", "${order.order_placed_at}", "${order.price}"), `;  
    })
  }))
    .then(data => connection.queryAsync(query.substring(0, query.length - 2))
      .then(data => data)
    )
}

const postUserSocialMedia = user => {
  let query = `INSERT INTO user_social_media (user_id, facebook_url, twitter_url, instagram_url) VALUES (
    (SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1), 
      "${user.social_media.facebook_url}", 
      "${user.social_media.twitter_url}", 
      "${user.social_media.instagram_url}"
      )`;
  connection.query(query);
}

// To add existing fake data items into db
const postUserWishlist = users => {
  let query = `INSERT INTO user_wishlist (user_id, product_id, created_at, related_items) VALUES `;
  return Promise.all(users.map(user => {
    user.wishlist.map(item => {
      query += `((SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1), "${item.product_id}", "${item.created_at}", "Related Items Here"), `;  
    })
  }))
    .then(data => connection.queryAsync(query.substring(0, query.length - 2))
      .then(data => data)
    )
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

const getUserObject = user_id => {
  let userInfo = {};
  let ops = [
    getUser(user_id),
    getUserDetails(user_id),
    getOrders(user_id),
    getWishlist(user_id),
    // getSocialMedia(user_id)
  ];

  return Promise.all(ops)
    .then(results => {
    userInfo = {
      "username" : results[0].name,
      "email" : results[0].email,
      "gender" : results[1].gender,
      "age" : results[1].age,
      "state" : results[1].state,
      "zip" : results[1].zip,
      "subscription_type" : results[1].subscription_type,
      "orders" : [],
      "wishlist" : [],
      // "social_media": [{ "facebook_url": results[4].facebook_url, "twitter_url": results[4].twitter_url, "instagram_url": results[4].instagram_url }]
    }
    results[2].map(order => { userInfo.orders.push({ "product_id": order.product_id }) })
    results[3].map(wish => { userInfo.wishlist.push({ "product_id": wish.product_id }) })
    return userInfo
  });
}

// To add single items to user's wishlist
const addToWishlist = (item, user_id) => 
    connection.queryAsync(`INSERT INTO user_wishlist (user_id, product_id, created_at, related_items) VALUES (?, ?, ?, ?)`, [user_id, item.product_id, item.createdAt, item.related_items])
      .then(data => data)

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

const getSocialMedia = user_id => 
    connection.queryAsync(`SELECT * FROM user_social_media WHERE user_id = ?`, [user_id])
      .then(data => data[0])

const getAnalytics = user_id => {
  // Analytics
}

// --------------------------- FAKE DATA GENERATOR -------------------------------//

const batchRequest = users => {
  postUser(users)
    .then(results => {
      console.log('results', results)
      let ops = [postUserDetails(users), postUserOrders(users), postUserWishlist(users)]
      return Promise.all(ops).then(data => data);
    })
}


const faker = async n => {
  n = 100000;
  interval = 1000;
  console.time(`Time took to create ${n} users`);
  for (let i = 0; i < n; i += interval) {
    let batch = [];
    for (let j = i; j < i + interval; j++) {
      batch.push(getFakeUser())
    }
    await batchRequest(batch);
    console.log(`User Entry #${i + interval} / ${n} `)
  }
  console.timeEnd(`Time took to create ${n} users`);
  return `SUCCESS! ${n} users entered into the database`
}



module.exports = {
  connection,
  postUser,
  postUserDetails,
  postUserOrders,
  postUserSocialMedia,
  postUserWishlist,
  loginUser,
  getUserObject,
  addToWishlist,
  getWishlist,
  getOrders, 
  getAnalytics,
  batchRequest,
  faker
}