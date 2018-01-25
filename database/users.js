const connection = require('./index');

const getById = id =>
  connection.queryAsync('SELECT * FROM users WHERE id = ?', [id]).then(data => data[0]);

const getByName = name =>
  connection.queryAsync('SELECT * FROM users WHERE name = ?', [name]).then(data => data[0]);

module.exports = {
  getById,
  getByName,
};
