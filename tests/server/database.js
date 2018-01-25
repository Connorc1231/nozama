const { expect } = require('chai');
const chai = require('chai');

const database = require('../../database');
const users = require('../../database/users');

describe('Database', () => {
  before(() => database.queryAsync('INSERT INTO users (name) VALUES ("testUser123")'));
  after(() => database.queryAsync('DELETE FROM users WHERE name = "testUser123"'));
  describe('users.getByName', () => {
    it('should return user object for valid user name in database', (done) => {
      users.getByName('testUser123').then((data) => {
        expect(data.id).to.be.a('number');
        expect(data.name).to.be.a('string');
        done();
      });
    }).timeout(1000);
    it('should return nothing for user name not in database', (done) => {
      users.getByName('testUser1234').then((data) => {
        expect(data).to.be.a('undefined');
        done();
      });
    }).timeout(1000);
  });
  describe('users.getById', () => {
    it('should return user object for valid user id in database', (done) => {
      users
        .getByName('testUser123')
        .then(data => users.getById(data.id))
        .then((data) => {
          expect(data.id).to.be.a('number');
          expect(data.name).to.be.a('string');
          done();
        });
    }).timeout(1000);
    it('should return nothing for user id not in database', (done) => {
      users.getById('-1').then((data) => {
        expect(data).to.be.a('undefined');
        done();
      });
    }).timeout(1000);
  });
});
