'use strict';

require('dotenv').config();
const config = require('./config/config');
const lib = require('./wsInterface');
const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');

const pathSocket = '/stomp';
const origins = [config.remote.servicUrl, 'http://localhost:8080'];

const router = new Router();
router.get('/ping', (ctx, next) => {
  ctx.body = `pong on ${Date.now()}. Please do not break my toy. ;)`;
});
router.get('/params', (ctx, next) => {
  if (ctx.headers.apikey !== '-remote-sspe-cli-web-') {
    ctx.body = 'Please do not break my toy. ;)';
    return;
  }
  ctx.body = config.remote;
});

const app = new Koa();
app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());

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
  if (origins[socket.client.request.headers['origin']] == -1) {
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

const PORT = Number(config.port);
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

process.on('unhandledRejection', err => {
  console.log('Proccess Error', err);
});
