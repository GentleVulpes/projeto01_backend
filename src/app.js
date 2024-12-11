const express = require('express');
const routes = require('./routes/routes');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(routes);

app.listen(3001, () => {
    console.log('running in the port 3001');
});