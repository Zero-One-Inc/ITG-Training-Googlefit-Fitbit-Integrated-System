
import winston from "winston";

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint()
      ),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File(
        { 
            filename: 'logs/logs.log',
            level: 'info' 
        }),
    ],
  });
  
export const formateLoggerMessage = (status, message) => {
    const formatedMessage = `Status: ${status} - Message: ${message}`;
    return formatedMessage;
}
export default logger;