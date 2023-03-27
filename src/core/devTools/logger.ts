// Part: src/core/devTools/logger.ts

import log, { LogLevelNames, LogLevelNumbers } from "loglevel";

// Set the log level
log.setLevel(log.levels.DEBUG);

// Store the original methodFactory
const originalMethodFactory = log.methodFactory;

// Customize the methodFactory to modify the log output format
const customMethodFactory = (
  methodName: LogLevelNames,
  logLevel: LogLevelNumbers,
  loggerName: string | symbol = "defaultLogger"
) => {
  const rawMethod = originalMethodFactory(methodName, logLevel, loggerName);
  return (...args: any[]) => {
    const timestamp = new Date().toLocaleTimeString();
    rawMethod(`[${timestamp}] ${methodName.toUpperCase()}:`, ...args);
  };
};

// Set the custom methodFactory to the logger
log.methodFactory = customMethodFactory;

// Create a map to store custom loggers
const loggers: Record<string, log.Logger> = {};

// Get a logger by moduleName
export function getLogger(moduleName: string) {
  if (!loggers[moduleName]) {
    loggers[moduleName] = log.getLogger(moduleName);
    loggers[moduleName].setLevel(log.levels.SILENT);
    loggers[moduleName].methodFactory = customMethodFactory;
  }
  return loggers[moduleName];
}

// Export the default logger
export default log;
