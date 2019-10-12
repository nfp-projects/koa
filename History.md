2.8.4 / 2019-10-11
==================

Unofficial fork of [Koa 2.8.2](https://github.com/koajs/koa) that is much smaller and lighter on dependancies:

Removed:
  * accepts
  * cache-content-type
  * content-type
  * cookies
  * delegates
  * depd
  * destroy
  * encodeurl
  * error-inject
  * escape-html
  * http-assert
  * is-generator-function
  * koa-compose
  * koa-convert
  * koa-is-json
  * on-finished
  * only
  * parseurl
  * statuses
  * vary
  
Replaced:
  * http-errors -> http-errors-lite
  * debug -> debug-ms (includes ms so one less dependancy)
  * content-disposition -> [content-disposition](https://github.com/jharrilim/content-disposition/commit/572383f01c83ea237beb46a307eb6748394f4f92)

Older history
=============

See here: [Koa History.md](https://github.com/koajs/koa/blob/master/History.md)
