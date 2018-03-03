var express = require('express');
var app = express();
app.use(express.static(__dirname + '/dist/'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/node_modules/workbox-sw/build/importScripts/:version', (request, response) => {
    response.sendFile(`${__dirname}/node_modules/workbox-sw/build/importScripts/${request.params.version}`);
});

app.listen(process.env.PORT || 4200, () => {
    console.log('http://localhost:4200');
});