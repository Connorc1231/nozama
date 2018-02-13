  /********************************************************************************************/ 
  /*    //       //   //////////  //////////      ///       ////       ////       ///         */ 
  /*    ////     //   //      //         //      // //      // //     // //      // //        */ 
  /*    // ///   //   //      //       //       //   //     //  //   //  //     //   //       */ 
  /*    //   /// //   //      //     //        /////////    //   // //   //    /////////      */ 
  /*    //     ////   //      //   //         //       //   //    ///    //   //       //     */ 
  /*    //       //   //////////  /////////  //         //  //           //  //         //    */ 
  /********************************************************************************************/

require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('../database/index');
const al = require('../database/analytics');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/../client/dist')));

app.get('/', (req, res) => {
  res.send('Welcome~');
});

/*  Get full user object
*   I: Null | O: Obj
*   Required params: { none }
*/
app.get('/user/:id', async (req, res) => {
  const data = await db.getUserObject(req.params.id);
  res.status(200).json(data);
});

/* Creates a user account
*  I: Obj | O: Obj
*  Required params: {
*    "firstName": STRING, "lastName": STRING, "email": STRING,
*    "username": STRING, "password": STRING, "age": INT, "gender": VARCHAR(1), "state": VARCHAR(2),
*    "orders": [{"product_id": INT, "order_placed_at": STRING(MM/DD/YYYY), "price": INT}],
*    "wishlist": [{"product_id": INT, "created_at": STRING(MM/DD/YYYY), "price": INT}]
*  }
*/
app.post('/user/signup', async (req, res) => {
  const response = await db.postUser(req.body);
  if (Number.isInteger(response)) {
    req.body['id'] = response;
    const ops = [
      db.postUserDetails([req.body]),
      db.postUserOrders([req.body]),
      db.postUserWishlist([req.body]),
    ];
    const data = await Promise.all(ops);
    res.status(201).json(data);
  } else {
    res.status(400).json('Username already exists!');
  }
});

/*  Logs user into account
*   I: Null | O: Obj
*   Required params: { "username": STRING, "password": STRING }
*/
app.post('/user/login', async (req, res) => {
  try {
    const loggedIn = await db.loginUser(req.body);
    if (loggedIn) {
      res.status(200).json('Logged In!');
    } else {
      throw ({ message: 'Username / Password invalid' });
    }
  } catch (err) {
    res.status(401).json(err);
  }
});

/*  Record an order
*   I: Obj | O: Obj
*   Required params: { "product_id": INT, "price": INT }
*/
app.post('/user/:id/orders', async (req, res) => {
  let dt = new Date();
  dt = ('0' + dt.getMonth()).slice(-2) + '/' + ('0' + dt.getDate()).slice(-2) + '/' + dt.getFullYear();
  req.body.order_placed_at = dt;
  const data = await db.addOrder(req.body, req.params.id);
  res.status(201).json(data);
});

/*  Get order history
*   I: Null | O: Obj
*   Required params: { none }
*/
app.get('/user/:id/orders', async (req, res) => {
  const data = await db.getOrders(req.params.id);
  if (!data.length) {
    res.status(404).json('No orders found for specified user!');
  }
  res.status(200).json(data);
});

/*  Add item to user's wishlist
*   I: Obj | O: Obj
*   Required params: { "product_id": INT, "related_items": ? }
*/
app.post('/user/:id/wishlist', async (req, res) => {
  let dt = new Date();
  dt = ('0' + dt.getMonth()).slice(-2) + '/' + ('0' + dt.getDate()).slice(-2) + '/' + dt.getFullYear();
  req.body.created_at = dt;
  const data = await db.addToWishlist(req.body, req.params.id);
  res.status(201).json(data);
});

/*  Get wishlist
*   I: Null | O: Obj
*   Required params: { none }
*/
app.get('/user/:id/wishlist', async (req, res) => {
  const data = await db.getWishlist(req.params.id);
  if (!data.length) {
    res.status(404).json('No wishlist found for specified user!');
  }
  res.status(200).json(data);
});

// --User Analytics------------------------------------------------------------------------------ //

/*  Get user analytics
*   I: Null | O: Obj
*   Required params: { none }
*/
app.get('/user/:id/analytics/wishlist', async (req, res) => {
  const data = await al.wishlistByAge(req.params.id);
  res.status(200).json(data);
});

const server = app.listen(process.env.PORT || 8000, () => {
  const { port } = server.address();
  console.log('Listening at port %s', port);
});

module.exports = {
  server,
};
