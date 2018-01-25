const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../index');
const database = require('../../database');

chai.use(chaiHttp);

describe('Sessions', () => {
  before(() => database.queryAsync('INSERT INTO users (name) VALUES ("testUser123")'));
  after(() => database.queryAsync('DELETE FROM users WHERE name = "testUser123"'));
  describe('POST /auth', () => {
    it('should deny user if username is invalid', (done) => {
      chai
        .request(server)
        .post('/auth')
        .type('application/json')
        .send(JSON.stringify({ username: 'testUser1234', password: 'asdf' }))
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    }).timeout(1000);
    it('should authenticate user if username is valid', (done) => {
      chai
        .request(server)
        .post('/auth')
        .type('application/json')
        .send(JSON.stringify({ username: 'testUser123', password: 'asdf' }))
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    }).timeout(1000);
    it('should create a session cookie', (done) => {
      chai
        .request(server)
        .post('/auth')
        .type('application/json')
        .send(JSON.stringify({ username: 'testUser123', password: 'asdf' }))
        .end((err, res) => {
          expect(res).to.have.cookie('connect.sid');
          done();
        });
    }).timeout(1000);
  });
  describe('GET /whoami', () => {
    it('should deny if not authenticated', (done) => {
      chai
        .request(server)
        .get('/whoami')
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    }).timeout(1000);
    it("should return the authenticated user's id", (done) => {
      const agent = chai.request.agent(server);
      agent
        .post('/auth')
        .type('application/json')
        .send(JSON.stringify({ username: 'testUser123', password: 'asdf' }))
        .then(res =>
          agent.get('/whoami').then((res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            done();
          }));
    }).timeout(1000);
  });
  describe('GET /auth', () => {
    it('should remove cookies and destroy session', (done) => {
      const agent = chai.request.agent(server);
      agent
        .post('/auth')
        .type('application/json')
        .send(JSON.stringify({ username: 'testUser123', password: 'asdf' }))
        .then(res =>
          agent.get('/auth').then((res) => {
            expect(res).to.have.status(200);
            expect(res).to.not.have.cookie('connect.sid');
            done();
          }));
    });
  });
});
