const winston = require('winston');

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',  // Default log level
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'app.log' }) // Log to a file
  ],
});

module.exports = logger;