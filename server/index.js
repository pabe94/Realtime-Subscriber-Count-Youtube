const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fetch = require('node-fetch');
const http = require('http');
const socketIO = require('socket.io');

const STATS_URL = 'https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UC_x5XG1OV2P6uZZ5FSM9Ttw&key={API KEY HERE}';


const app = express();
const server = http.Server(app);
const io = socketIO(server);

let latestStats;

app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨Hello World! 🌈✨🦄'
  });
});


function getLatestStats(){
    return fetch(STATS_URL)
        .then(res => res.json())
        .then(result => {
            latestStats = result.items[0].statistics;
            io.emit('stats', latestStats);
            setTimeout(() => {
                getLatestStats();
            }, 5000);
        });
}

getLatestStats();

app.get('/stats', (req, res) => {
    res.json(latestStats);
});

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found - ' + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log('Listening on port', port);
});
