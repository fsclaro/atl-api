const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.API_PORT || 3005;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

require('./app/controllers/index')(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
