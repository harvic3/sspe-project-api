'use strict';

const lib = require('./wsInterface');
// const app = require('express')();
// var cors = require('cors');
// var corsOptions = {
//   //origin: 'http://localhost:8080',
//   // origin: 'https://sspe-cli-web.vickodev.now.sh/',
//   origin: '*',
//   optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

// const server = require('http').Server(app);
const server = require('http').createServer(onRequest);
const origin = 'https://sspe-cli-web.vickodev.now.sh';
const allowedOrigins =
  'https://sspe-cli-web.vickodev.now.sh:* wss://sspe-cli-web.vickodev.now.sh:* localhost:* ws://localhost:* http://localhost:*';
const pathSocket = '/stomp';
const io = require('socket.io')(server, {
  serveClient: false,
  origins: '*:*',
  path: pathSocket,
  rejectUnauthorized: false,
  transports: ['polling', 'websocket'],
});

// app.get('/ping', (req, res) => {
//   res.send('pong');
// });

function onRequest(req, res) {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'Authorization, X-API-KEY, Origin, X-Forwarded-Host, X-Forwarded-Proto, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
    'Allow': 'GET, POST, OPTIONS, PUT, DELETE',
  });
}

io.on('connection', async socket => {
  console.log(socket.client.request.headers['origin']);
  // if (socket.client.request.headers['origin'] !== origin) {
  //   socket.disconnect();
  // }
  console.log('Connected');
  socket.on('chat_message', async data => {
    // console.log('Received data: ', data);
    const response = await lib.processCommand(data);
    socket.emit('chat_message', response);
  });
});

const PORT = 3030;
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

process.on('unhandledRejection', err => {
  console.log(`Error: ${err}`);
});
