const assert = require('assert');
const http = require('http');
const net = require('net');
const onFinished = require('../../lib/onfinish');

describe('onFinished(res, listener)', () => {
  it('should invoke listener given an unknown object', done => {
    onFinished({}, done);
  });

  describe('when the response finishes', () => {
    it('should fire the callback', done => {
      let server = http.createServer((req, res) => {
        onFinished(res, done);
        setTimeout(res.end.bind(res), 0);
      });

      sendGet(server);
    });

    it('should include the response object', done => {
      let server = http.createServer((req, res) => {
        onFinished(res, (err, msg) => {
          assert.ok(!err);
          assert.strictEqual(msg, res);
          done();
        });
        setTimeout(res.end.bind(res), 0);
      });

      sendGet(server);
    });

    it('should fire when called after finish', done => {
      let server = http.createServer((req, res) => {
        onFinished(res, () => {
          onFinished(res, done);
        });
        setTimeout(res.end.bind(res), 0);
      });

      sendGet(server);
    });
  });

  describe('when using keep-alive', () => {
    it('should fire for each response', done => {
      let called = false;
      let server = http.createServer((req, res) => {
        onFinished(res, () => {
          if (called) {
            socket.end();
            server.close();
            done(called !== req ? null : new Error('fired twice on same req'));
            return;
          }

          called = req;

          writeRequest(socket);
        });

        res.end();
      });
      let socket;

      server.listen(function(){
        socket = net.connect(this.address().port, function(){
          writeRequest(this);
        });
      });
    });
  });

  describe('when requests pipelined', () => {
    it('should fire for each request', done => {
      let count = 0;
      let responses = [];
      let server = http.createServer((req, res) => {
        responses.push(res);

        onFinished(res, err => {
          assert.ifError(err);
          assert.strictEqual(responses[0], res);
          responses.shift();

          if (responses.length === 0) {
            socket.end();
            return;
          }

          responses[0].end('response b');
        });

        onFinished(req, err => {
          assert.ifError(err);

          if (++count !== 2) {
            return;
          }

          assert.strictEqual(responses.length, 2);
          responses[0].end('response a');
        });

        if (responses.length === 1) {
          // second request
          writeRequest(socket);
        }

        req.resume();
      });
      let socket;

      server.listen(function(){
        let data = '';
        socket = net.connect(this.address().port, function(){
          writeRequest(this);
        });

        socket.on('data', chunk => {
          data += chunk.toString('binary');
        });
        socket.on('end', () => {
          assert.ok(/response a/.test(data));
          assert.ok(/response b/.test(data));
          server.close(done);
        });
      });
    });
  });

  describe('when response errors', () => {
    it('should fire with error', done => {
      let server = http.createServer((req, res) => {
        onFinished(res, err => {
          assert.ok(err);
          server.close(done);
        });

        socket.on('error', noop);
        socket.write('W');
      });
      let socket;

      server.listen(function(){
        socket = net.connect(this.address().port, function(){
          writeRequest(this, true);
        });
      });
    });

    it('should include the response object', done => {
      let server = http.createServer((req, res) => {
        onFinished(res, (err, msg) => {
          assert.ok(err);
          assert.strictEqual(msg, res);
          server.close(done);
        });

        socket.on('error', noop);
        socket.write('W');
      });
      let socket;

      server.listen(function(){
        socket = net.connect(this.address().port, function(){
          writeRequest(this, true);
        });
      });
    });
  });

  describe('when the response aborts', () => {
    it('should execute the callback', done => {
      let client;
      let server = http.createServer((req, res) => {
        onFinished(res, close(server, done));
        setTimeout(client.abort.bind(client), 0);
      });
      server.listen(function(){
        let port = this.address().port;
        client = http.get('http://127.0.0.1:' + port);
        client.on('error', noop);
      });
    });
  });

  describe('when calling many times on same response', () => {
    it('should not print warnings', done => {
      let server = http.createServer((req, res) => {
        let stderr = captureStderr(() => {
          for (let i = 0; i < 400; i++) {
            onFinished(res, noop);
          }
        });

        onFinished(res, done);
        assert.strictEqual(stderr, '');
        res.end();
      });

      server.listen(function(){
        let port = this.address().port;
        http.get('http://127.0.0.1:' + port, res => {
          res.resume();
          res.on('end', server.close.bind(server));
        });
      });
    });
  });
});

/**********************************************************
* Removed request tests as those are not needed by our app
***********************************************************/

function captureStderr(fn){
  let chunks = [];
  let write = process.stderr.write;

  process.stderr.write = function write(chunk, encoding){
    chunks.push(new Buffer(chunk, encoding));
  };

  try {
    fn();
  } finally {
    process.stderr.write = write;
  }

  return Buffer.concat(chunks).toString('utf8');
}

function close(server, callback){
  return function(error){
    server.close(err => {
      callback(error || err);
    });
  };
}

function noop(){}

function sendGet(server){
  server.listen(function onListening(){
    let port = this.address().port;
    http.get('http://127.0.0.1:' + port, res => {
      res.resume();
      res.on('end', server.close.bind(server));
    });
  });
}

function writeRequest(socket, chunked){
  socket.write('GET / HTTP/1.1\r\n');
  socket.write('Host: localhost\r\n');
  socket.write('Connection: keep-alive\r\n');

  if (chunked) {
    socket.write('Transfer-Encoding: chunked\r\n');
  }

  socket.write('\r\n');
}
