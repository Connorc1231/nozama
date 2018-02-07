const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('../database/index.js'); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/../client/dist'));

app.get('/', (req, res) => {
  res.send('Welcome~');
})

/*  Get full user object
*   I: Null | O: Obj
*   Required params: { none }
*/
app.get('/user/:id', async (req, res) => {
  console.time('time');
  let data = await db.getUserObject(req.params.id);
  console.timeEnd('time');
  res.status(200).json(data);
})

/* Creates a user account
*  I: Obj | O: Obj
*  Required params: {
*    "firstName": STRING, "lastName": STRING, "email": STRING, 
*    "username": STRING, "password": STRING, "age": INT, "gender": VARCHAR(1), "state": VARCHAR(2), 
*    "orders": [{"product_id": INT, "order_placed_at": STRING(MM/DD/YYYY), "price": INT}],
*    "wishlist": [{"product_id": INT, "created_at": STRING(MM/DD/YYYY), "price": INT}],
*  }
*/
app.post('/user/signup', async (req, res) => {
  let response = await db.postUser(req.body)
    .then(results => {
      if (Number.isInteger(results)) {
        req.body['id'] = results;
        let ops = [db.postUserDetails([req.body]), db.postUserOrders([req.body]), db.postUserWishlist([req.body])]
        return Promise.all(ops).then(data => data);
      } else {
        res.status(400).json('Username already exists!')
      }
    })
  res.status(201).json(response);
})

/*  Logs user into account
*   I: Null | O: Obj
*   Required params: { "username": STRING, "password": STRING }
*/
app.post('/user/login', async (req, res) => {
  try {
    let data = await db.loginUser(req.body);
    if (!data) { throw 'Incorrect username / password!' }
    res.status(200).json('Logged In!');
  } catch (err) {
    res.status(401).json(err);
  }
})

/*  Record an order
*   I: Obj | O: Obj
*   Required params: { "product_id": INT, "order_placed_at": STRING('MM/DD/YYYY'), "price": INT }
*/
app.post('/user/:id/orders', async (req, res) => {
  let dt = new Date();
  dt = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
  req.body.order_placed_at = dt;
  let data = await db.addOrder(req.body, req.params.id);
  res.status(201).json(data);
})

/*  Get order history
*   I: Null | O: Obj
*   Required params: { none }
*/
app.get('/user/:id/orders', async (req, res) => {
  let data = await db.getOrders(req.params.id)
  res.status(200).json(data);
})

/*  Add item to user's wishlist
*   I: Obj | O: Obj
*   Required params: { "product_id": INT, "created_at": STRING('MM/DD/YYYY'), "related_items": ? }
*/
app.post('/user/:id/wishlist', async (req, res) => {
  let dt = new Date();
  dt = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
  req.body.created_at = dt;
  let data = await db.addToWishlist(req.body, req.params.id);
  res.status(201).json(data);
})

/*  Get wishlist
*   I: Null | O: Obj
*   Required params: { none }
*/
app.get('/user/:id/wishlist', async (req, res) => {
  let data = await db.getWishlist(req.params.id);
  res.status(200).json(data);
})

/*  Get user analytics
*   I: Null | O: Obj
*   Required params: { none }
*/
app.get('/user/:id/analytics', async (req, res) => {
  let data = await db.getAnalytics(req.params.id)
  res.status(200).json(data);
})

const server = app.listen(process.env.PORT || 8000, () => {
  let port = server.address().port;
  console.log('Listening at port %s', port);
});

module.exports = server;
