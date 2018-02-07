const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

const getFakeUser = require('../../user/data/faker')
const server = require('../../user/server/index');
const database = require('../../user/database/index');

chai.use(chaiHttp);

describe('Server', () => {
  // describe('POST /user/signup', () => {
  //   let testUser = 
  //   it('should return status 201', done => {
  //     chai
  //       .request(server)
  //       .post('/user/signup')
  //       .send()
  //       .end((err, res) => {
  //         console.log(res)
  //         expect(res.statusCode).to.equal(201);
  //         done();
  //       });
  //   }).timeout(500);
  // })

  // GET ORDER
  before(() => database.connection.queryAsync('INSERT INTO user_orders (product_id, order_placed_at, price, user_id) VALUES (1337, "1997-06-09", 19.99, 13337)'));
  after(() => database.connection.queryAsync('DELETE FROM user_orders WHERE product_id = "1337"'));
  describe('GET /user/:id/orders', () => {
    it('should return status 200', done => {
      chai
        .request(server)
        .get('/user/13337/orders')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        })
    }).timeout(500);
    it('should return an array of objects', done => {
      chai
        .request(server)
        .get('/user/13337/orders')
        .end((err, res) => {
          expect(res.body).to.be.an('array');
          done();
        })
    }).timeout(500);
    it('each order object should include a product_id', done => {
      chai
        .request(server)
        .get('/user/13337/wishlist')
        .end((err, res) => {
          expect(res.body[res.body.length - 1].product_id).to.equal(1337);
          done();
        })
    }).timeout(500);
  })

  // GET WISHLIST
  before(() => database.connection.queryAsync('INSERT INTO user_wishlist (user_id, product_id, created_at, related_items) VALUES (13337, 1337, "1997-06-09", "test")'));
  after(() => database.connection.queryAsync('DELETE FROM user_wishlist WHERE product_id = "1337"'));
  describe('GET /user/:id/wishlist', () => {
    it('should return status 200', done => {
      chai
        .request(server)
        .get('/user/13337/wishlist')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        })
    }).timeout(500);
    it('should return an array of objects', done => {
      chai
        .request(server)
        .get('/user/13337/wishlist')
        .end((err, res) => {
          expect(res.body).to.be.an('array');
          done();
        })
    }).timeout(500);
    it('each wishlist object should include a product_id', done => {
      chai
        .request(server)
        .get('/user/13337/wishlist')
        .end((err, res) => {
          expect(res.body[0].product_id).to.not.equal(1337);
          done();
        })
    }).timeout(500);
  })

  // GET USER
  describe('GET /user/:id', () => {
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
    it('user object should include relevant fields', done => {
      chai
        .request(server)
        .get('/user/13337')
        .end((err, res) => {
          let passing = false
          if (res.body.username && res.body.email && res.body.orders && res.body.wishlist) {
            passing = true;
          }
          expect(passing).to.eql(true);
          done();
        })
    }).timeout(500);
  })


  // before(() => database.queryAsync('INSERT INTO users (name) VALUES ("testUser123")'));
  // after(() => database.queryAsync('DELETE FROM users WHERE name = "testUser123"'));
  // describe('users.getByName', () => {
  //   it('should return user object for valid user name in database', (done) => {
  //     users.getByName('testUser123').then((data) => {
  //       expect(data.id).to.be.a('number');
  //       expect(data.name).to.be.a('string');
  //       done();
  //     });
  //   }).timeout(1000);
  //   it('should return nothing for user name not in database', (done) => {
  //     users.getByName('testUser1234').then((data) => {
  //       expect(data).to.be.a('undefined');
  //       done();
  //     });
  //   }).timeout(1000);
  // });
  // describe('users.getById', () => {
  //   it('should return user object for valid user id in database', (done) => {
  //     users
  //       .getByName('testUser123')
  //       .then(data => users.getById(data.id))
  //       .then((data) => {
  //         expect(data.id).to.be.a('number');
  //         expect(data.name).to.be.a('string');
  //         done();
  //       });
  //   }).timeout(1000);
  //   it('should return nothing for user id not in database', (done) => {
  //     users.getById('-1').then((data) => {
  //       expect(data).to.be.a('undefined');
  //       done();
  //     });
  //   }).timeout(1000);
  // });
});
