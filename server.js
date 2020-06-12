'use strict';

const config = require('./config/config');
const lib = require('./wsInterface');
const Koa = require('koa');
const pathSocket = '/stomp';
const origin =
  config.env != 'DEV' ? 'https://sspengine.now.sh/' : 'http://localhost:8080';

const app = new Koa();

app.on('error', (err, ctx) => {
  console.log(`${new Date()} Server error: ${err.message}`);
});

const server = require('http').Server(app.callback());
const io = require('socket.io')(server, {
  serveClient: false,
  origins: '*:*',
  path: pathSocket,
  rejectUnauthorized: false,
  transports: ['polling', 'websocket'],
});

io.on('connection', async socket => {
  console.log(socket.client.request.headers['origin']);
  if (socket.client.request.headers['origin'] !== origin) {
    console.log(
      `Unauthorized origin ${new Date()} ${
        socket.client.request.headers['origin']
      }`
    );
    socket.disconnect();
    return;
  }
  console.log(`${new Date()} CLIENT connected`);
  socket.on('chat_message', async data => {
    console.log('Received data: ', data);
    const response = await lib.processCommand(data);
    socket.emit('chat_message', response);
  });
});

const PORT = config.port;
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

process.on('unhandledRejection', err => {
  console.log('Proccess Error', err);
});
