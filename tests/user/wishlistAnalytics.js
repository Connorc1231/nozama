const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../user/server/index');
const connection = require('../../user/database/connection');

chai.use(chaiHttp);

  // GET wishlist analytics
describe('GET Users => Analytics => Wishlist', () => {
  let data = {};
  chai
  .request(server)
  .get('/user/analytics/1/wishlist')
  .end((err, res) => {
    data = res
  })
  it('should return status 200', done => {
    expect(data).to.have.status(200);
    done();
  }).timeout(200);
  it('should return a recommendations array', done => {
    expect(data.body).to.be.an('array');
    expect(data.body.length).to.be.at.least(1)
    done();
  }).timeout(200);
  it('should include objects with relevant info', done => {
    expect(data.body[0].product_id).to.not.equal(undefined);
    expect(data.body[0].strength).to.not.equal(undefined);
    done();
  }).timeout(200);
})