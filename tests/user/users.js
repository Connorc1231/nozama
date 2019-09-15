const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../user/server/index');
const connection = require('../../user/database/connection');

chai.use(chaiHttp);

// GET user
describe('GET Users', () => {
  it('should return status 200', done => {
    chai
      .request(server)
      .get('/user/13337')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      })
  }).timeout(500);
  it('should return a user object', done => {
    chai
      .request(server)
      .get('/user/13337')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        done();
      })
  }).timeout(500);
  it('should include relevant fields', done => {
    chai
      .request(server)
      .get('/user/13337')
      .end((err, res) => {
        expect(res.body.username).to.not.equal(undefined);
        expect(res.body.email).to.not.equal(undefined);
        expect(res.body.orders).to.not.equal(undefined);
        expect(res.body.wishlist).to.not.equal(undefined);
        done();
      })
  }).timeout(500);
})