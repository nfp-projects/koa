## Koa-lite

  This is a tiny (improved) fork of [Koa](https://github.com/koajs/koa) that is about 50% smaller in disc space and uses a lot less dependancies, a total of 8 packages compared to Koa's 42 package installation. It also uses some improved versions to some of the previous dependencies. Overall the whole installation can be expected to go from 807KB to less than 425KB.

<img src="/docs/logo.png" alt="Koa middleware framework for nodejs"/>

  [![gitter][gitter-image]][gitter-url]
  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![PR's Welcome][pr-welcoming-image]][pr-welcoming-url]

## What is Koa

  Expressive HTTP middleware framework for node.js to make web applications and APIs more enjoyable to write. Koa's middleware stack flows in a stack-like manner, allowing you to perform actions downstream then filter and manipulate the response upstream.

  Only methods that are common to nearly all HTTP servers are integrated directly into Koa's small ~570 SLOC codebase. This
  includes things like content negotiation, normalization of node inconsistencies, redirection, and a few others.

  Koa is not bundled with any middleware.

## Installation

Koa requires __node v7.6.0__ or higher for ES2015 and async function support.

```
$ npm install koa-lite
```

## Hello Koa

```js
const Koa = require('koa-lite');
const app = new Koa();

// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(3000);
```

## Getting started

 - [Kick-Off-Koa](https://github.com/koajs/kick-off-koa) - An intro to Koa via a set of self-guided workshops.
 - [Workshop](https://github.com/koajs/workshop) - A workshop to learn the basics of Koa, Express' spiritual successor.
 - [Introduction Screencast](http://knowthen.com/episode-3-koajs-quickstart-guide/) - An introduction to installing and getting started with Koa


## Middleware

Koa is a middleware framework that can take two different kinds of functions as middleware:

  * async function
  * common function

Here is an example of logger middleware with each of the different functions:

### ___async___ functions (node v7.6+)

```js
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
```

### Common function

```js
// Middleware normally takes two parameters (ctx, next), ctx is the context for one request,
// next is a function that is invoked to execute the downstream middleware. It returns a Promise with a then function for running code after completion.

app.use((ctx, next) => {
  const start = Date.now();
  return next().then(() => {
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  });
});
```

## Context, Request and Response

Each middleware receives a Koa `Context` object that encapsulates an incoming
http message and the corresponding response to that message.  `ctx` is often used
as the parameter name for the context object.

```js
app.use(async (ctx, next) => { await next(); });
```

Koa provides a `Request` object as the `request` property of the `Context`.  
Koa's `Request` object provides helpful methods for working with
http requests which delegate to an [IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage)
from the node `http` module.

Koa provides a `Response` object as the `response` property of the `Context`.  
Koa's `Response` object provides helpful methods for working with
http responses which delegate to a [ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse)
.  

Koa's pattern of delegating to Node's request and response objects rather than extending them
provides a cleaner interface and reduces conflicts between different middleware and with Node
itself as well as providing better support for stream handling.  The `IncomingMessage` can still be
directly accessed as the `req` property on the `Context` and `ServerResponse` can be directly
accessed as the `res` property on the `Context`.

Here is an example using Koa's `Response` object to stream a file as the response body.

```js
app.use(async (ctx, next) => {
  await next();
  ctx.response.type = 'xml';
  ctx.response.body = fs.createReadStream('really_large.xml');
});
```

The `Context` object also provides shortcuts for methods on its `request` and `response`.  In the prior
examples,  `ctx.type` can be used instead of `ctx.response.type`.

For more information on `Request`, `Response` and `Context`, see the [Request API Reference](docs/api/request.md),
[Response API Reference](docs/api/response.md) and [Context API Reference](docs/api/context.md).

## Koa Application

The object created when executing `new Koa()` is known as the Koa application object.

The application object is Koa's interface with node's http server and handles the registration
of middleware, dispatching to the middleware from http, default error handling, as well as
configuration of the context, request and response objects.

Learn more about the application object in the [Application API Reference](docs/api/index.md).

## Documentation

 - [Usage Guide](docs/guide.md)
 - [Error Handling](docs/error-handling.md)
 - [Koa for Express Users](docs/koa-vs-express.md)
 - [FAQ](docs/faq.md)
 - [API documentation](docs/api/index.md)

## Troubleshooting

Check the [Troubleshooting Guide](docs/troubleshooting.md) or [Debugging Koa](docs/guide.md#debugging-koa) in
the general Koa guide.

## Running tests

```
$ npm test
```

## Reporting vulnerabilities

To report a security vulnerability, please do not open an issue, as this notifies attackers
of the vulnerability. Instead, please email [dead_horse](mailto:heyiyu.deadhorse@gmail.com) and [jonathanong](mailto:me@jongleberry.com) to
disclose.

## Authors

See [AUTHORS](AUTHORS).

## Community

 - [Badgeboard](https://koajs.github.io/badgeboard) and list of official modules
 - [Examples](https://github.com/koajs/examples)
 - [Middleware](https://github.com/koajs/koa/wiki) list
 - [Wiki](https://github.com/koajs/koa/wiki)
 - [G+ Community](https://plus.google.com/communities/101845768320796750641)
 - [Reddit Community](https://www.reddit.com/r/koajs)
 - [Mailing list](https://groups.google.com/forum/#!forum/koajs)
 - [中文文档 v1.x](https://github.com/guo-yu/koa-guide)
 - [中文文档 v2.x](https://github.com/demopark/koa-docs-Zh-CN)
 - __[#koajs]__ on freenode

# License

  [MIT](https://github.com/koajs/koa/blob/master/LICENSE)

[npm-image]: https://img.shields.io/npm/v/koa-lite.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/koa-lite
[travis-image]: https://img.shields.io/travis/nfp-projects/koa-lite/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/nfp-projects/koa-lite
[gitter-image]: https://img.shields.io/gitter/room/koajs/koa.svg?style=flat-square
[gitter-url]: https://gitter.im/koajs/koa?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[#koajs]: https://webchat.freenode.net/?channels=#koajs
[pr-welcoming-image]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[pr-welcoming-url]: https://github.com/koajs/koa/pull/new
