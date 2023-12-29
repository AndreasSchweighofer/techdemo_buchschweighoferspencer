// test/app.test.js
const request = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('GET /', () => {
  it('sollte Hello World! zurückgeben', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        expect(res.text).to.equal('Hello World!');
        done(err);
      });
  });
});