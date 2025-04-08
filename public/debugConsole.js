var consoleDebug = function () {
  let getStackTrace = function () {
    let obj = {};
    Error.captureStackTrace(obj, getStackTrace);
    return obj.stack;
  };
  let log = console.log;
  console.log = function () {
    let stack = getStackTrace() || "";
    let str = stack.split(")")[2].replace("\n", "");
    // console.warn(arguments, str)
    if (arguments.length) {
      arguments[arguments.length] = str;
      arguments.length++;
    }
    log.apply(console, arguments);
  };

  let info = console.info;
  console.info = function () {
    let stack = getStackTrace() || "";
    let str = stack.split(")")[2].replace("\n", "");
    // console.warn(arguments, str)
    if (arguments.length) {
      arguments[arguments.length] = str;
      arguments.length++;
    }
    info.apply(console, arguments);
  };

  let warn = console.warn;
  console.warn = function () {
    let stack = getStackTrace() || "";
    let str = stack.split(")")[2].replace("\n", "");
    // console.warn(arguments, str)
    if (arguments.length) {
      arguments[arguments.length] = str;
      arguments.length++;
    }
    warn.apply(console, arguments);
  };

  let error = console.error;
  console.error = function () {
    let stack = getStackTrace() || "";
    let str = stack.split(")")[2].replace("\n", "");
    // console.warn(arguments, str)
    if (arguments.length) {
      arguments[arguments.length] = str;
      arguments.length++;
    }
    error.apply(console, arguments);
  };
};

consoleDebug();
