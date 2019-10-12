const getMimetype = require('./getmimetype');

module.exports = function accepts(ctx, type, ask) {
  if (!ctx._accept) {
    ctx._accept = {};
  }
  if (!ctx._accept[type]) {
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

  let can = ctx._accept[type];

  // If empty argument, return all supported can
  if (ask.length === 0) {
    return can;
  }

  // If no supported was sent, return the first ask item
  if (!can.length) {
    return ask[0];
  }

  let parsed = ask.slice();

  if (type === 'accept') {
    for (let t = 0; t < parsed.length; t++) {
      parsed[t] = getMimetype(parsed[t]) || parsed[t];
    }
  }

  // Loop over the supported can, returning the first
  // matching ask type.
  for (let i = 0; i < can.length; i++) {
    for (let t = 0; t < parsed.length; t++) {
      // Check if we allow root checking (application/*)
      if (type === 'accept') {
        let allowRoot = can[i].indexOf('/*') >= 0;

        // Big if :)
        if (can[i] === '*/*'
          || can[i].indexOf(parsed[t]) >= 0
          || (allowRoot
            && parsed[t].indexOf('/') >= 0
            && can[i].split('/')[0] === parsed[t].split('/')[0]
          )) {
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
