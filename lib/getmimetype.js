module.exports = function getMimetype(type, includeCharset) {
  let charset = includeCharset ? '; charset=utf-8' : '';

  if (type.indexOf('json') >= 0 || type.indexOf('css.map') >= 0 || type.indexOf('js.map') >= 0) {
    return 'application/json' + charset;
  } else if (type.indexOf('html') >= 0) {
    return 'text/html' + charset;
  } else if (type.indexOf('css') >= 0) {
    return 'text/css' + charset;
  } else if (type.indexOf('js') >= 0 || type.indexOf('javascript') >= 0) {
    return 'application/javascript' + charset;
  } else if (type.indexOf('png') >= 0) {
    return 'image/png';
  } else if (type.indexOf('svg') >= 0) {
    return 'image/svg+xml';
  } else if (type.indexOf('jpg') >= 0) {
    return 'image/jpeg';
  } else if (type.indexOf('jpeg') >= 0) {
    return 'image/jpeg';
  } else if (type.indexOf('gif') >= 0) {
    return 'image/gif';
  } else if (type.indexOf('text') >= 0 || type.indexOf('txt') >= 0) {
    return 'text/plain' + charset;
  } else if (type.indexOf('bin') >= 0) {
    return 'application/octet-stream';
  }
};
