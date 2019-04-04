"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var DispatchEventNode_1 = require("../EventMgr/DispatchEventNode");
var ResponseMessageEvent = /** @class */ (function (_super) {
    __extends(ResponseMessageEvent, _super);
    function ResponseMessageEvent(type) {
        return _super.call(this, type, null) || this;
    }
    ResponseMessageEvent.prototype.SetData = function (head, msg) {
        this.cmd = head.cmd.toString();
        this.data = { head: head, msg: msg };
    };
    Object.defineProperty(ResponseMessageEvent.prototype, "Data", {
        get: function () {
            return this.data;
        },
        enumerable: true,
        configurable: true
    });
    return ResponseMessageEvent;
}(DispatchEventNode_1.EventData));
exports.ResponseMessageEvent = ResponseMessageEvent;
