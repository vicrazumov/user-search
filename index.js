const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const routes = require('./routes');
routes.initRoutes(app);

const PORT = process.env.PORT || 8000;

app.listen(PORT, function() {
  console.log(`Listening on port ${PORT}`);
});


module.exports = app;
