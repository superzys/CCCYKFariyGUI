"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Log = /** @class */ (function () {
    function Log() {
    }
    Log.Log = console.log;
    Log.Error = console.error;
    Log.Warn = console.warn();
    return Log;
}());
exports.Log = Log;
