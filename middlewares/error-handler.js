const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: message || 'Произошла ошибка на сервере',
    });

  return next();
}

module.exports = errorHandler;