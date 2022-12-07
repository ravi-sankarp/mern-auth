import colors from 'colors';
import { NextFunction, Request, Response } from 'express';

export default (
  err: Error & { status: number },
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
