
'use strict';

const assert = require('assert');
const context = require('../helpers/context');

describe('ctx.querystring', () => {
  it('should return the querystring', () => {
    const ctx = context({ url: '/store/shoes?page=2&color=blue' });
    assert.equal(ctx.querystring, 'page=2&color=blue');
  });

  describe('when ctx.req not present', () => {
    it('should return an empty string', () => {
      const ctx = context();
      ctx.request.req = null;
      assert.equal(ctx.querystring, '');
    });
  });
});

describe('ctx.querystring=', () => {
  it('should replace the querystring', () => {
    const ctx = context({ url: '/store/shoes' });
    ctx.querystring = 'page=2&color=blue';
    assert.equal(ctx.url, '/store/shoes?page=2&color=blue');
    assert.equal(ctx.querystring, 'page=2&color=blue');
  });

  it('should update ctx.search and ctx.query', () => {
    const ctx = context({ url: '/store/shoes' });
    ctx.querystring = 'page=2&color=blue';
    assert.equal(ctx.url, '/store/shoes?page=2&color=blue');
    assert.equal(ctx.search, '?page=2&color=blue');
    assert.equal(ctx.query.page, '2');
    assert.equal(ctx.query.color, 'blue');
  });

  it('should change .url but not .originalUrl', () => {
    const ctx = context({ url: '/store/shoes' });
    ctx.querystring = 'page=2&color=blue';
    assert.equal(ctx.url, '/store/shoes?page=2&color=blue');
    assert.equal(ctx.originalUrl, '/store/shoes');
    assert.equal(ctx.request.originalUrl, '/store/shoes');
  });
});
