const request = require('supertest');
const { expect } = require('chai');
const { app, startServer } = require('../app');

describe('GET /', () => {
  let server;

  // Starten des Servers vor den Tests
  before((done) => {
    server = startServer();
    done();
  });

  // Stoppen des Servers nach den Tests
  after((done) => {
    server.close(done);
  });

  it('sollte Hello World! zurückgeben', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        expect(res.text).to.equal('Hello World!');
        done(err);
      });
  });
});