const mysql = require('mysql');

// export MYSQL_URL="mysql://user:pass@host/db"
let connection = mysql.createConnection(process.env.MYSQL_URL || {
      host     : 'localhost',
      user     : 'root',
      database : 'nozama',
      password : '',
    });

console.log(process.env.MYSQL_URL);

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
