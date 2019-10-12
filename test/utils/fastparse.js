const assert = require('assert');
const fastparse = require('../../lib/fastparse');

const URL_EMPTY_VALUE = null;

describe('fastparse(url)', () => {
  it('should parse the requrst URL', () => {
    let url = fastparse('/foo/bar');
    assert.strictEqual(url.host, URL_EMPTY_VALUE);
    assert.strictEqual(url.hostname, URL_EMPTY_VALUE);
    assert.strictEqual(url.href, '/foo/bar');
    assert.strictEqual(url.pathname, '/foo/bar');
    assert.strictEqual(url.port, URL_EMPTY_VALUE);
    assert.strictEqual(url.query, URL_EMPTY_VALUE);
    assert.strictEqual(url.search, URL_EMPTY_VALUE);
  });

  it('should parse with query string', () => {
    let url = fastparse('/foo/bar?fizz=buzz');
    assert.strictEqual(url.host, URL_EMPTY_VALUE);
    assert.strictEqual(url.hostname, URL_EMPTY_VALUE);
    assert.strictEqual(url.href, '/foo/bar?fizz=buzz');
    assert.strictEqual(url.pathname, '/foo/bar');
    assert.strictEqual(url.port, URL_EMPTY_VALUE);
    assert.strictEqual(url.query, 'fizz=buzz');
    assert.strictEqual(url.search, '?fizz=buzz');
  });

  it('should parse a full URL', () => {
    let url = fastparse('http://localhost:8888/foo/bar');
    assert.strictEqual(url.host, 'localhost:8888');
    assert.strictEqual(url.hostname, 'localhost');
    assert.strictEqual(url.href, 'http://localhost:8888/foo/bar');
    assert.strictEqual(url.pathname, '/foo/bar');
    assert.strictEqual(url.port, '8888');
    assert.strictEqual(url.query, URL_EMPTY_VALUE);
    assert.strictEqual(url.search, URL_EMPTY_VALUE);
  });

  it('should not choke on auth-looking URL', () => {
    assert.strictEqual(fastparse('//todo@txt').pathname, '//todo@txt');
  });
});
