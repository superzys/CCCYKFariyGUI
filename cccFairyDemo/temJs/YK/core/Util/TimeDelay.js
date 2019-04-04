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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var TimeDelay = /** @class */ (function (_super) {
    __extends(TimeDelay, _super);
    function TimeDelay() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * 当前事件执行的次数
         */
        _this.repeat = 0;
        _this.items = new Array();
        _this.toAdd = new Array();
        _this.toRemove = new Array();
        _this.pool = new Array();
        _this.lastTime = 0;
        _this.deltaTime = 0;
        return _this;
    }
    TimeDelay_1 = TimeDelay;
    Object.defineProperty(TimeDelay, "Instance", {
        get: function () {
            if (this.mInstance == null) {
                var no = new cc.Node("TimeDelayMgr");
                cc.game.addPersistRootNode(no);
                this.mInstance = no.addComponent(TimeDelay_1);
            }
            return this.mInstance;
        },
        enumerable: true,
        configurable: true
    });
    TimeDelay.prototype.GetFromPool = function () {
        var t;
        if (this.pool.length > 0) {
            t = this.pool.pop();
        }
        else
            t = new TimeDelayData();
        return t;
    };
    TimeDelay.prototype.ReturnToPool = function (t) {
        t.set(0, 0, null, null, null);
        t.elapsed = 0;
        t.deleted = false;
        this.pool.push(t);
    };
    TimeDelay.prototype.Exists = function (callback, thisObj) {
        var t = this.toAdd.find(function (value, index, obj) {
            return value.callback == callback && value.thisObj == thisObj;
        });
        if (t != null) {
            return true;
        }
        t = this.items.find(function (value, index, obj) {
            return value.callback == callback && value.thisObj == thisObj;
        });
        if (t != null && !t.deleted) {
            return true;
        }
        return false;
    };
    TimeDelay.prototype.Add = function (interval, repeat, callback, thisObj, callbackParam) {
        if (callbackParam === void 0) { callbackParam = null; }
        var t;
        t = this.items.find(function (value, index, obj) {
            return value.callback == callback && value.thisObj == thisObj;
        });
        if (t == null) {
            t = this.toAdd.find(function (value, index, obj) {
                return value.callback == callback && value.thisObj == thisObj;
            });
        }
        if (t == null) {
            t = this.GetFromPool();
            this.toAdd.push(t);
        }
        t.set(interval, repeat, callback, thisObj, callbackParam);
        t.deleted = false;
        t.elapsed = 0;
    };
    TimeDelay.prototype.AddUpdate = function (callback, thisObj, callbackParam) {
        if (callbackParam === void 0) { callbackParam = null; }
        this.Add(0.001, 0, callback, thisObj, callbackParam);
    };
    TimeDelay.prototype.Remove = function (callback, thisObj) {
        var findindex = -1;
        var t = this.toAdd.find(function (value, index, obj) {
            if (value.callback == callback && value.thisObj == thisObj) {
                findindex = index;
                return true;
            }
            else {
                return false;
            }
        });
        if (t != null) {
            this.toAdd.splice(findindex, 1);
            this.ReturnToPool(t);
        }
        t = this.items.find(function (value, index, obj) { return value.callback == callback && value.thisObj == thisObj; });
        if (t != null)
            t.deleted = true;
    };
    TimeDelay.prototype.start = function () {
        this.lastTime = Date.now();
    };
    TimeDelay.prototype.update = function () {
        this.deltaTime = (Date.now() - this.lastTime) / 1000;
        this.lastTime = Date.now();
        for (var index = 0; index < this.items.length; index++) {
            var t = this.items[index];
            if (t.deleted) {
                this.toRemove.push(t);
                continue;
            }
            t.elapsed += this.deltaTime;
            if (t.elapsed < t.interval) {
                continue;
            }
            t.elapsed = 0;
            if (t.repeat > 0) {
                t.repeat--;
                if (t.repeat == 0) {
                    t.deleted = true;
                    this.toRemove.push(t);
                }
            }
            this.repeat = t.repeat;
            if (t.callback != null) {
                try {
                    t.callback.call(t.thisObj, t.param);
                }
                catch (error) {
                    t.deleted = true;
                }
            }
        }
        var len = this.toRemove.length;
        while (len) {
            var t_1 = this.toRemove.pop();
            var index_1 = this.items.indexOf(t_1);
            if (t_1.deleted && index_1 != -1) {
                this.items.splice(index_1, 1);
                this.ReturnToPool(t_1);
            }
            len--;
        }
        len = this.toAdd.length;
        while (len) {
            var t_2 = this.toAdd.pop();
            this.items.push(t_2);
            len--;
        }
    };
    var TimeDelay_1;
    TimeDelay.mInstance = null;
    TimeDelay = TimeDelay_1 = __decorate([
        ccclass
    ], TimeDelay);
    return TimeDelay;
}(cc.Component));
exports.TimeDelay = TimeDelay;
var TimeDelayData = /** @class */ (function () {
    function TimeDelayData() {
    }
    TimeDelayData.prototype.set = function (interval, repeat, callback, thisObj, param) {
        this.interval = interval;
        this.repeat = repeat;
        this.callback = callback;
        this.param = param;
        this.thisObj = thisObj;
    };
    return TimeDelayData;
}());
exports.TimeDelayData = TimeDelayData;
