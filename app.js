
var express = require('express');
const AerolineaApi = require('./routes');


var app = express();
app.use(express.json());
AerolineaApi(app);

app.listen(3000, () => {
  console.log(`Listening http://localhost:3000`);
});

module.exports = app;
