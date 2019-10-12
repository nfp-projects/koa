/**
 * Call callback when request finished. Lifted off of
 * npm on-finished with slight optimizations.
 */

module.exports = function onFinished(msg, callback) {
  let alreadyFinished = false;

  // Make sure it hasn't finished already.
  // Although I highly doubt this code is necessary.
  if (typeof msg.finished === 'boolean') {
    alreadyFinished = msg.finished || (msg.socket && !msg.socket.writable);
  } else if (typeof msg.complete === 'boolean') {
    alreadyFinished = msg.upgrade || !msg.socket || !msg.socket.readable || (msg.complete && !msg.readable);
  } else {
    // We don't support this object so end immediately
    alreadyFinished = true;
  }

  if (alreadyFinished) {
    return setImmediate(callback, null, msg);
  }

  if (msg.__onFinished) {
    return msg.__onFinished.push(callback);
  }
  msg.__onFinished = [callback];

  let socket = null;
  let finished = false;

  function onFinish(error) {
    if (finished) return;

    msg.removeListener('end', onFinish);
    msg.removeListener('finish', onFinish);

    if (socket) {
      socket.removeListener('error', onFinish);
      socket.removeListener('close', onFinish);
    }

    socket = null;
    finished = true;

    msg.__onFinished.forEach(cb => cb(error, msg));
  }

  msg.on('end', onFinish);
  msg.on('finish', onFinish);

  function onSocket(newSocket) {
    // remove listener
    msg.removeListener('socket', onSocket);

    if (finished) return;
    if (socket) return;

    socket = newSocket;

    // finished on first socket event
    socket.on('error', onFinish);
    socket.on('close', onFinish);
  }

  if (msg.socket) {
    // socket already assigned
    onSocket(msg.socket);
    return;
  }

  // wait for socket to be assigned
  msg.on('socket', onSocket);
};
