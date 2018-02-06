const mysql = require('mysql');

// export MYSQL_URL="mysql://connor:password@13.57.26.4/nozama"
let connection = mysql.createConnection(process.env.MYSQL_URL || {
      host     : 'localhost',
      user     : 'root',
      database : 'nozama',
      password : '',
      // host     : '13.57.26.4',
      // user     : 'connor',
      // database : 'nozama',
      // password : 'password',
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