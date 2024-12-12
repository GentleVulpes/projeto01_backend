const express = require('express');
const routes = require('./routes/routes');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(routes);

app.listen(PORT, () => {
    console.log('running in the port 3001');
});