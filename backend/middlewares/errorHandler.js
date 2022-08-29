import colors from 'colors';

export default (err, req, res, next) => {
   // Sending error message
   res.status(err.status || res.statusCode || 500);
   console.error(
      colors.red(`\n \n URL:${req.url}\n Message:${err.message}`) +
         colors.yellow(`\n Stack:${err.stack} \n \n`)
   );
   res.json({
      message: err.message,
      details: {
         stack: req.app.get('env') === 'development' ? err.stack : {}
      }
   });
};
