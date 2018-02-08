const mysql = require('mysql');

// export MYSQL_URL="mysql://connor:password@52.53.191.141/nozama"
let connection = mysql.createConnection({
      // host     : '52.53.191.141',
      // user     : 'connor',
      // database : 'nozama',
      // password : 'password',
    // } || {
      host     : 'localhost',
      user     : 'root',
      database : 'nozama',
      password : '',
    });

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

module.exports = connection;
