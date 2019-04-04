"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameFlag = /** @class */ (function () {
    function GameFlag(flag) {
        if (flag === void 0) { flag = 0; }
        /// <summary>
        /// 标志量
        /// </summary>
        this.mValue = 0;
        this.mValue = flag;
    }
    Object.defineProperty(GameFlag.prototype, "Value", {
        get: function () {
            return this.mValue;
        },
        set: function (v) {
            this.mValue = v;
        },
        enumerable: true,
        configurable: true
    });
    GameFlag.prototype.Add = function (flag) {
        this.mValue |= flag;
        return this;
    };
    GameFlag.prototype.Remove = function (flag) {
        this.mValue &= ~flag;
        return this;
    };
    GameFlag.prototype.Has = function (flag) {
        return (this.mValue & flag) != 0;
    };
    return GameFlag;
}());
exports.GameFlag = GameFlag;
