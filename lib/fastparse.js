const url = require('url');

/**
 * Parse the `str` url with fast-path short-cut.
 *
 * @param {string} str
 * @return {Object}
 * @private
 */

module.exports = function fastparse(str) {
  if (typeof str !== 'string' || str.charCodeAt(0) !== 0x2f /* / */) {
    return url.parse(str);
  }

  let pathname = str;
  let query = null;
  let search = null;

  // This takes the regexp from https://github.com/joyent/node/pull/7878
  // Which is /^(\/[^?#\s]*)(\?[^#\s]*)?$/
  // And unrolls it into a for loop
  for (let i = 1; i < str.length; i++) {
    switch (str.charCodeAt(i)) {
      case 0x3f: /* ?  */
        if (search === null) {
          pathname = str.substring(0, i);
          query = str.substring(i + 1);
          search = str.substring(i);
        }
        break;
      case 0x09: /* \t */
      case 0x0a: /* \n */
      case 0x0c: /* \f */
      case 0x0d: /* \r */
      case 0x20: /*    */
      case 0x23: /* #  */
      case 0xa0:
      case 0xfeff:
        return url.parse(str);
    }
  }

  let parsed = new url.Url();

  parsed.path = str;
  parsed.href = str;
  parsed.pathname = pathname;

  if (search !== null) {
    parsed.query = query;
    parsed.search = search;
  }
  parsed.__raw = str;

  return parsed;
};
