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
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var DispatchEventNode = /** @class */ (function (_super) {
    __extends(DispatchEventNode, _super);
    function DispatchEventNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.eventDataPools = new Array();
        _this.eventDic = {};
        return _this;
    }
    DispatchEventNode.prototype.createEventData = function (cmd, data) {
        var ev;
        if (this.eventDataPools.length > 0) {
            ev = this.eventDataPools.pop();
            ev.cmd = cmd;
            ev.data = data;
            ev.isSotp = false;
        }
        else {
            ev = new EventData(cmd, data);
        }
        return ev;
    };
    DispatchEventNode.prototype.returnEventData = function (ev) {
        ev.data = null;
        ev.cmd = null;
        ev.isSotp = false;
        this.eventDataPools.push(ev);
    };
    // onLoad()
    // {
    //     this.node.on("__DispatchEvent", this.OnDispatchEvent, this)
    // }
    // onDestroy()
    // {
    //     super.onDestroy()
    //     this.node.off("__DispatchEvent", this.OnDispatchEvent, this)
    // }
    /**
     * 添加一个消息监听器
     * @param type 消息类型
     * @param callBack 回调函数
     * @param target 作用对象
     * @param priority 消息的优先级
     * @param once 是否只监听一次
     */
    DispatchEventNode.prototype.addEventListener = function (type, callBack, target, priority, once) {
        if (priority === void 0) { priority = 0; }
        if (once === void 0) { once = false; }
        type = type.toString();
        var info = {
            callBack: callBack,
            target: target,
            priority: priority,
            once: once
        };
        var array = this.eventDic[type];
        var has = false;
        var pos = 0;
        if (array != null) {
            array.forEach(function (element) {
                if (element.target == target && element.callBack == callBack) {
                    has = true;
                }
                if (element.priority > info.priority) {
                    pos++;
                }
            });
        }
        else {
            array = new Array();
            this.eventDic[type] = array;
        }
        if (has) {
            console.error("重复注册消息：type=" + type);
        }
        else {
            array.splice(pos, 0, info);
        }
    };
    /**
     * 移除一个消息监听器
     * @param type 消息id
     * @param callBack 回调函数
     * @param target 作用的对象
     */
    DispatchEventNode.prototype.removeEventListener = function (type, callBack, target) {
        type = type.toString();
        var info = null;
        var array = this.eventDic[type];
        if (array != null) {
            var infoIndex_1 = -1;
            array.every(function (value, index, array) {
                if (value.target == target && value.callBack == callBack) {
                    infoIndex_1 = index;
                    info = value;
                    return false;
                }
                return true;
            });
            if (infoIndex_1 != -1) {
                array.splice(infoIndex_1, 1);
            }
        }
    };
    /**
     * 是否存在这个监听消息
     * @param type 消息类型
     * @param callBack 回调类型
     * @param target 回调对象
     */
    DispatchEventNode.prototype.hasEventListener = function (type, callBack, target) {
        var flag = false;
        var array = this.eventDic[type];
        if (array) {
            var index = array.findIndex(function (obj, index, any) {
                return obj.target == target && obj.callBack == callBack;
            });
            flag = index != -1;
        }
        return flag;
    };
    /**
     * 派发消息
     * @param ev 派发的消息内容
     */
    DispatchEventNode.prototype.DispatchEvent = function (ev) {
        this._DispatchEvent(ev);
    };
    /**
     * 派发消息
     * @param type 消息id
     * @param data 消息内容
     */
    DispatchEventNode.prototype.DispatchEventByType = function (type, data) {
        if (data === void 0) { data = null; }
        var ev = this.createEventData(type, data);
        this._DispatchEvent(ev);
        if (ev != null) {
            this.returnEventData(ev);
        }
    };
    DispatchEventNode.prototype._DispatchEvent = function (ev) {
        var array = this.eventDic[ev.cmd];
        if (array != null) {
            for (var i = 0; i < array.length; i++) {
                var info = array[i];
                if (info.callBack != null) {
                    info.callBack.call(info.target, ev);
                }
                if (info.once) {
                    array.splice(i--, 1);
                }
                if (ev.isSotp) {
                    break;
                }
            }
        }
    };
    return DispatchEventNode;
}(cc.Component));
exports.DispatchEventNode = DispatchEventNode;
var EventData = /** @class */ (function (_super) {
    __extends(EventData, _super);
    function EventData(cmd, obj) {
        var _this = _super.call(this, cmd, false) || this;
        _this.isSotp = false;
        _this.cmd = cmd;
        _this.data = obj;
        _this.isSotp = false;
        return _this;
    }
    /**
     * Stop
     */
    EventData.prototype.Stop = function () {
        this.isSotp = true;
    };
    return EventData;
}(cc.Event));
exports.EventData = EventData;
var Func = /** @class */ (function () {
    function Func(thisObj, callBack) {
        this.mThisObj = thisObj;
        this.mCallBack = callBack;
    }
    Func.prototype.Invoke = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        (_a = this.mCallBack).call.apply(_a, [this.mThisObj].concat(args));
    };
    return Func;
}());
exports.Func = Func;
