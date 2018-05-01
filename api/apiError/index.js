module.exports = function(req, res, next) {
  res.apiError = function(code, err) {
    if (code) {
      res.status(code);
    }
    else {
      res.status(500);
    }

    if (err) {
      return res.json(err);
    }
    return res.send('server error');
  };

  next();
};
