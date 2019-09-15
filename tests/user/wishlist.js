const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../user/server/index');
const connection = require('../../user/database/connection');

chai.use(chaiHttp);

// GET wishlist
describe('GET Users => Wishlist', () => {
  it('should return status 200', done => {
    chai
      .request(server)
      .get('/user/1337/wishlist')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      })
  }).timeout(500);
  it('should return an array of objects', done => {
    chai
      .request(server)
      .get('/user/1337/wishlist')
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        done();
      })
  }).timeout(500);
  it('should include a product_id', done => {
    chai
      .request(server)
      .get('/user/1337/wishlist')
      .end((err, res) => {
        expect(res.body[0].product_id).to.not.equal(1337);
        done();
      })
  }).timeout(500);
  it('should include related items', done => {
    chai
      .request(server)
      .get('/user/1337/wishlist')
      .end((err, res) => {
        expect(res.body[res.body.length - 1].related_items).to.not.equal(undefined);
        done();
      })
  }).timeout(500);
})

  