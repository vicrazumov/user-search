const api = require('./api');
const apiError = require('./api/apiError');

const ERROR_404_MESSAGE = "Unable to resolve the request";

const initRoutes = app => {
  app.use(apiError);

  app.get('/api/users', (req, res) => api.getUsers(req, res));

  app.all('*', (req, res) => res.apiError(404, ERROR_404_MESSAGE));
};

module.exports = {
  initRoutes,
};
