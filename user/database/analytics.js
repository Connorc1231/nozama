const connection = require('./connection.js');

const wishlistByAge = (user_id) =>
  connection.queryAsync(`SELECT product_id, COUNT(product_id) AS strength FROM user_wishlist WHERE user_id in (
      SELECT user_id FROM user_wishlist where product_id IN (
        SELECT product_id FROM user_wishlist where user_id=${user_id}
      )
    ) AND product_id NOT IN (
      SELECT product_id FROM user_wishlist where user_id=${user_id}
    ) GROUP BY 1 ORDER BY 2 DESC LIMIT 5`
  );

module.exports = {
  wishlistByAge,
};
