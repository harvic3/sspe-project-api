'use strict';

require('dotenv').config();
const config = require('./config/config');
const lib = require('./wsInterface');
const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');

const pathSocket = '/stomp';
const origins = [config.remote.clientUrl, 'http://localhost:8080'];
const router = new Router();
router.get('/ping', (ctx, next) => {
  ctx.body = `pong on ${Date.now()}. Please do not break my toy. ;P`;
});
router.get('/params', (ctx, next) => {
  if (ctx.headers['x-api-key'] === config.apiKey) {
    ctx.body = config.remote;
    return;
  }
  ctx.body = 'Please do not break my toy. ;P';
});

const app = new Koa();
app.use(
  cors({
    origin: function (ctx) {
      console.log('Origin: ', ctx.request.header.origin);
      if (origins.includes(ctx.request.header.origin)) {
        return ctx.request.header.origin;
      }
      return false;
    },
    credentials: true,
  })
);
app.use(router.routes());
app.use(router.allowedMethods());

app.on('error', (err, ctx) => {
  console.log(`${new Date()} Server error: ${err.message}`);
});

const server = require('http').Server(app.callback());
const io = require('socket.io')(server, {
  cors: {
    origin: origins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  serveClient: false,
  path: pathSocket,
  rejectUnauthorized: false,
  transports: ['polling', 'websocket'],
});

io.on('connection', async socket => {
  console.log(socket.client.request.headers['origin']);
  if (!origins.includes(socket.client.request.headers['origin'])) {
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
  console.log('Process Error', err);
});
