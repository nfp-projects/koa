# Request

  A Koa `Request` object is an abstraction on top of node's vanilla request object,
  providing additional functionality that is useful for every day HTTP server
  development.

## API

### request.header

 Request header object.  This is the same as the [`headers`](https://nodejs.org/api/http.html#http_message_headers) field
 on node's [`http.IncomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage).

### request.header=

 Set request header object.

### request.headers

 Request header object. Alias as `request.header`.

### request.headers=

  Set request header object. Alias as `request.header=`.

### request.method

  Request method.

### request.method=

  Set request method, useful for implementing middleware
  such as `methodOverride()`.

### request.length

  Return request Content-Length as a number when present, or `undefined`.

### request.url

  Get request URL.

### request.url=

  Set request URL, useful for url rewrites.

### request.originalUrl

  Get request original URL.

### request.origin

  Get origin of URL, include `protocol` and `host`.

```js
ctx.request.origin
// => http://example.com
```

### request.href

  Get full request URL, include `protocol`, `host` and `url`.

```js
ctx.request.href;
// => http://example.com/foo/bar?q=1
```

### request.path

  Get request pathname.

### request.path=

  Set request pathname and retain query-string when present.

### request.querystring

  Get raw query string void of `?`.

### request.querystring=

  Set raw query string.

### request.search

  Get raw query string with the `?`.

### request.search=

  Set raw query string.

### request.host

  Get host (hostname:port) when present. Supports `X-Forwarded-Host`
  when `app.proxy` is __true__, otherwise `Host` is used.

### request.hostname

  Get hostname when present. Supports `X-Forwarded-Host`
  when `app.proxy` is __true__, otherwise `Host` is used.
  
  If host is IPv6, Koa delegates parsing to
  [WHATWG URL API](https://nodejs.org/dist/latest-v8.x/docs/api/url.html#url_the_whatwg_url_api),
  *Note* This may impact performance.

### request.URL

  Get WHATWG parsed URL object.

### request.type

  Get request `Content-Type` void of parameters such as "charset".

```js
const ct = ctx.request.type;
// => "image/png"
```

### request.charset

  Get request charset when present, or `undefined`:

```js
ctx.request.charset;
// => "utf-8"
```

### request.query

  Get parsed query-string, returning an empty object when no
  query-string is present. Note that this getter does _not_
  support nested parsing.

  For example "color=blue&size=small":

```js
{
  color: 'blue',
  size: 'small'
}
```

### request.query=

  Set query-string to the given object. Note that this
  setter does _not_ support nested objects.

```js
ctx.query = { next: '/login' };
```

### request.fresh

  Check if a request cache is "fresh", aka the contents have not changed. This
  method is for cache negotiation between `If-None-Match` / `ETag`, and `If-Modified-Since` and `Last-Modified`. It should be referenced after setting one or more of these response headers.

```js
// freshness check requires status 20x or 304
ctx.status = 200;
ctx.set('ETag', '123');

// cache is ok
if (ctx.fresh) {
  ctx.status = 304;
  return;
}

// cache is stale
// fetch new data
ctx.body = await db.find('something');
```

### request.stale

  Inverse of `request.fresh`.

### request.protocol

  Return request protocol, "https" or "http". Supports `X-Forwarded-Proto`
  when `app.proxy` is __true__.

### request.secure

  Shorthand for `ctx.protocol == "https"` to check if a request was
  issued via TLS.

### request.ip

  Request remote address. Supports `X-Forwarded-For` when `app.proxy`
  is __true__.

### request.ips

  When `X-Forwarded-For` is present and `app.proxy` is enabled an array
  of these ips is returned, ordered from upstream -> downstream. When disabled
  an empty array is returned.

### request.subdomains

  Return subdomains as an array.

  Subdomains are the dot-separated parts of the host before the main domain of
  the app. By default, the domain of the app is assumed to be the last two
  parts of the host. This can be changed by setting `app.subdomainOffset`.

  For example, if the domain is "tobi.ferrets.example.com":
  If `app.subdomainOffset` is not set, `ctx.subdomains` is `["ferrets", "tobi"]`.
  If `app.subdomainOffset` is 3, `ctx.subdomains` is `["tobi"]`.

### request.is(types...)

  Check if the incoming request contains the "Content-Type"
  header field, and it contains any of the give mime `type`s.
  If there is no request body, `null` is returned.
  If there is no content type, or the match fails `false` is returned.
  Otherwise, it returns the matching content-type.

```js
// With Content-Type: text/html; charset=utf-8
ctx.is('html'); // => 'html'
ctx.is('text/html'); // => 'text/html'
ctx.is('text/*', 'text/html'); // => 'text/html'

// When Content-Type is application/json
ctx.is('json', 'urlencoded'); // => 'json'
ctx.is('application/json'); // => 'application/json'
ctx.is('html', 'application/*'); // => 'application/json'

ctx.is('html'); // => false
```

  For example if you want to ensure that
  only images are sent to a given route:

```js
if (ctx.is('image/*')) {
  // process
} else {
  ctx.throw(415, 'images only!');
}
```

### request.idempotent

  Check if the request is idempotent.

### request.socket

  Return the request socket.

### request.get(field)

  Return request header with case-insensitive `field`.
