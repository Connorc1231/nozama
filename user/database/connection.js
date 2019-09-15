const mysql = require('mysql');

// export MYSQL_URL="mysql://user:pass@host/db"
// export MYSQL="mysql://connor:password@54.215.152.15/nozama"
const connection = mysql.createConnection(process.env.MYSQL_URL || {
  host: 'localhost',
  user: 'root',
  database: 'nozama',
  password: '',
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
