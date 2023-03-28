// Part: src/core/components/logger.ts

import chalk from "chalk";
import log, { LogLevelNames, LogLevelNumbers } from "loglevel";

const colors = {
  trace: chalk.magenta,
  debug: chalk.cyan,
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red
};

log.setLevel(log.levels.INFO);

const originalMethodFactory = log.methodFactory;

const customMethodFactory = (
  methodName: LogLevelNames,
  logLevel: LogLevelNumbers,
  loggerName: string | symbol = "global"
) => {
  const rawMethod = originalMethodFactory(methodName, logLevel, loggerName);
  return (...args: any[]) => {
    const timestamp = new Date().toLocaleTimeString();
    rawMethod(`${chalk.gray(`[${timestamp}]`)} ` +
      `${colors[methodName](methodName.toUpperCase())} ` +
      `${chalk.green(`${loggerName}`)}\n`, ...args);
  };
};

log.methodFactory = customMethodFactory;
const loggers: Record<string, log.Logger> = {};

export function getLogger(moduleName: string) {
  if (!loggers[moduleName]) {
    loggers[moduleName] = log.getLogger(moduleName);
    loggers[moduleName].setLevel(log.levels.INFO);
    loggers[moduleName].methodFactory = customMethodFactory;
  }
  return loggers[moduleName];
}

export default log;
