const getMimetype = require('./getmimetype');

module.exports = function accepts(ctx, type, ask, isReq = true) {
  if (!ctx._accept) {
    ctx._accept = {};
  }

  // We don't need to parse content-type
  if (!ctx._accept[type] && type !== 'content-type') {
    let types = ctx.req.headers[type];
    let quality = 9999; // Little bit of a hack :)
    if (types) {
      types = types.split(',')
        .map(x => {
          x = x.trim();
          let q = quality--;
          if (x.indexOf('q=') >= 0) {
            q = parseFloat(x.substr(x.indexOf('q=') + 2)) || 1;
            x = x.substr(0, x.indexOf(';'));
          }
          return [x, q];
        })
        .sort((a, b) => b[1] - a[1])
        .map(x => x[0]);
    } else {
      types = [];
    }

    if (type === 'accept-encoding') {
      types.push('identity');
    }
    ctx._accept[type] = types;
  }

  let can;

  if (type === 'content-type') {
    if (isReq) {
      // Check if a request has a request body.
      // A request with a body __must__ either have `transfer-encoding`
      // or `content-length` headers set.
      // http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.3
      if (ctx.req.headers['transfer-encoding'] === undefined
          && isNaN(ctx.req.headers['content-length'])) {
        return null;
      }
      can = ctx.req.headers[type];
    } else {
      can = ctx.type;
    }
  } else {
    can = ctx._accept[type];
    if (!can.length) can = null;
  }

  // If empty argument, return all supported can
  if (ask.length === 0 && can) {
    return can || false;
  }

  // If no supported was sent, return the first ask item
  // unless we're dealing with content-type we need to be smarter.
  if (!can) {
    if (type === 'content-type') {
      return false;
    }
    return ask[0];
  }

  let parsed = ask.slice();

  if (type === 'accept' || type === 'content-type') {
    for (let t = 0; t < parsed.length; t++) {
      if (parsed[t].startsWith('*/')) {
        parsed[t] = parsed[t].substr(2);
      } else if (parsed[t].indexOf('/*') < 0) {
        parsed[t] = getMimetype(parsed[t]) || parsed[t];
      }
    }
    if (type === 'content-type') {
      can = [can.split(';')[0]];
    }
  }

  // Loop over the supported can, returning the first
  // matching ask type.
  for (let i = 0; i < can.length; i++) {
    for (let t = 0; t < parsed.length; t++) {
      // Check if we allow root checking (application/*)
      if (type === 'accept' || type === 'content-type') {
        let allowRoot = can[i].indexOf('/*') >= 0
          || parsed[t].indexOf('/*') >= 0;

        // Big if :)
        if (can[i] === '*/*'
          || can[i].indexOf(parsed[t]) >= 0
          || (allowRoot
            && parsed[t].indexOf('/') >= 0
            && can[i].split('/')[0] === parsed[t].split('/')[0]
          )) {
          if (type === 'content-type') {
            if (ask[t].indexOf('/') === -1) {
              return ask[t];
            }
            return can[i];
          }
          return ask[t];
        }
      } else {
        if (can[i] === parsed[t]) {
          return ask[t];
        }
      }
    }
  }
  return false;
};
