import colors from 'colors';

export default (err, req, res, next) => {
  // Sending error message
  res.status(err.status ||res.status|| 500);
  console.error(
    colors.red(`\n \n METHOD:${req.method}\n ROUTE:${req.url}\n Message:${err.message}\n`) +
      colors.blue(`\n Stack:${err.stack} \n \n`)
  );
  res.json({
    message: err.message,
    details: {
      stack: req.app.get('env') === 'development' ? err.stack : {}
    }
  });
};
