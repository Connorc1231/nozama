const mysql = require('mysql');
const getFakeUser = require('../data/userData.js');
const analytics = require('./analytics.js');

// export MYSQL_URL="mysql://connor:password@13.57.26.4/nozama"
let connection = mysql.createConnection(process.env.MYSQL_URL || {
      // host     : 'localhost',
      // user     : 'root',
      // database : 'nozama',
      // password : '',
      host     : '13.57.26.4',
      user     : 'connor',
      database : 'nozama',
      password : 'password',
    });

connection.queryAsync = function queryAsync(...args) {
  return new Promise((resolve, reject) => {
    console.log('args', ...args);
    this.query(...args, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
};

// ---------------------------------------- Functions to populate tables ---------------------------------------- //

const postUser = user => {
  let query = `INSERT INTO users (name, email, password) VALUES`;
  return connection.queryAsync(`SELECT name FROM users WHERE name = "${user.username}"`)
  // return connection.queryAsync(`SELECT name FROM users WHERE name = "${user.username}"`)
    .then(data => {
      if (data.length) {
        console.log('User already exists!');
        Promise.reject(false);
      } else {
        query += `("${user.username}", "${user.email}", "${user.password}"), `;
      }
    })
    .then(data => connection.queryAsync(query.substring(0, query.length - 2))
      .then(data => data)
    )
    .then(data => connection.queryAsync('(SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1)')
      .then(data => data[0].user_id)
    )
    .catch(error => error);
}

const postUserDetails = users => {
  let query = `INSERT INTO user_details (user_id, zip, state, gender, age) VALUES `;
  return Promise.all(users.map(user => {
    user.zip = user.zip.slice(0, 5)
    query += `(
      "${user.id}", 
      "${user.zip}",
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

// const postUserSocialMedia = users => {
//   let query = `INSERT INTO user_social_media (user_id, facebook_url, twitter_url, instagram_url) VALUES (
//       "${user.id}", 
//       "${user.social_media.facebook_url}", 
//       "${user.social_media.twitter_url}", 
//       "${user.social_media.instagram_url}"
//       )`;
//   connection.query(query);
// }

// ---------------------------------------------------------------------------------------------------- //

const loginUser = user => 
  new Promise((resolve, reject) => 
    connection.query('SELECT * FROM users WHERE name=?', [user.username], (err, data) => {
      if (err) { reject(err) }
      else { 
        if (data[0].password === user.password) { resolve(data[0]) } 
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
  let ops = [
    getUser(user_id),
    getUserDetails(user_id),
    getOrders(user_id),
    getWishlist(user_id),
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
      "orders" : [],
      "wishlist" : [],
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

const getSocialMedia = user_id => 
    connection.queryAsync(`SELECT * FROM user_social_media WHERE user_id = ?`, [user_id])
      .then(data => data[0])

// ---------------------------------------------------------------------------------------------- //

const getAnalytics = user_id => {
  // Analytics
}

// --------------------------- FAKE DATA GENERATOR -------------------------------//

const batchRequest = async user => 
  new Promise((resolve, reject) => 
    postUser(user)
      .then(lastUserId => {
        user.id = lastUserId
        resolve(user)
      })
      .catch(error => error)
  )




const faker = async n => {
  n = 1000;
  console.time(`Total time for ${n}`);
  for (let o = 0; o < n; o += 100) {
    let batch = []
    for (let i = o; i < o + 100; i++) {
      console.time(`User Entry #${i + 1} / ${n} took`);
      let result = await batchRequest(getFakeUser());
      if (result) {
        batch.push(result);
      }
      console.timeEnd(`User Entry #${i + 1} / ${n} took`);
    }
    postUserDetails(batch);
    postUserOrders(batch);
    postUserWishlist(batch);
  }
  console.timeEnd(`Total time for ${n}`);
  return `SUCCESS! ${n} users entered into the database`
}



module.exports = {
  connection,
  postUser,
  postUserDetails,
  postUserOrders,
  postUserWishlist,
  loginUser,
  getUserObject,
  addToWishlist,
  addOrder,
  getWishlist,
  getOrders, 
  getAnalytics,
  batchRequest,
  faker
}