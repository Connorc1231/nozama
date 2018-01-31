const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('../database/index.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/../client/dist'));

app.post('/user/signup', async (req, res) => {
  db.postUser([req.body]);
  db.postUserDetails([req.body]);
  db.postUserOrders([req.body]);
  // db.postUserSocialMedia([req.body]);
  db.postUserWishlist([req.body]);
  res.status(201).json([req.body]);
})

app.post('/faker/:num', async (req, res) => {
  let data = await db.faker(req.params.num);
  res.status(200).json(req.body);
})

app.post('/user/login', async (req, res) => {
  try {
    let data = await db.loginUser(req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json(err);
  }
})

app.post('/user/:id/wishlist', async (req, res) => {
  let dt = new Date();
  dt = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
  req.body.createdAt = dt;
  let data = await db.addToWishlist(req.body, req.params.id);
  res.status(201).json(data);
})

app.get('/user/:id/wishlist', async (req, res) => {
  let data = await db.getWishlist(req.params.id);
  res.status(200).json(data);
})

app.get('/user/:id/orders', async (req, res) => {
  let data = await db.getOrders(req.params.id)
  res.status(200).json(data);
})

app.get('/user/:id/analytics', async (req, res) => {
  let data = await db.getAnalytics(req.params.id)
  res.status(200).json(data);
})

app.get('/user/:id', async (req, res) => {
  let data = await db.getUserObject(req.params.id);
  res.status(200).json(data);
})

const server = app.listen(process.env.PORT || 6969, () => {
  let port = server.address().port;
  console.log('Listening at port %s', port);
});

module.exports = server;
