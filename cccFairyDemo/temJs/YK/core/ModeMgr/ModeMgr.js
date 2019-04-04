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
var EventListenerMgr_1 = require("../EventMgr/EventListenerMgr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ModeMgr = /** @class */ (function (_super) {
    __extends(ModeMgr, _super);
    function ModeMgr() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mModes = new Map();
        _this.mIsLoginSendingFlag = false;
        return _this;
    }
    Object.defineProperty(ModeMgr, "Instance", {
        get: function () {
            if (this.mInstance == null) {
                var node = new cc.Node("ModeMgr");
                cc.game.addPersistRootNode(node);
                this.mInstance = node.addComponent(ModeMgr);
            }
            return this.mInstance;
        },
        enumerable: true,
        configurable: true
    });
    ModeMgr.prototype.AddMode = function (type) {
        if (!this.mModes.has(type)) {
            console.log("not mode is add =" + type);
            this.mModes.set(type, new type());
        }
        console.log("add mode over=" + type);
        return this.mModes.get(type);
    };
    ModeMgr.prototype.GetMode = function (type) {
        if (this.mModes.has(type))
            return this.mModes.get(type);
        else
            return null;
    };
    ModeMgr.prototype.InitData = function (param) {
        if (param === void 0) { param = null; }
        this.mIsLoginSendingFlag = false;
        this.mModes.forEach(function (value, key, map) {
            value.initMsgRespOk = false;
            value.OnInitData(param);
        });
    };
    ModeMgr.prototype.SendInitMsg = function () {
        this.mIsLoginSendingFlag = true;
        this.mModes.forEach(function (value, key, map) {
            value.OnSendInitMsg();
        });
    };
    ModeMgr.prototype.ClearData = function () {
        this.mModes.forEach(function (value, key, map) {
            value.OnClear();
        });
    };
    ModeMgr.prototype.onDestroy = function () {
        this.mModes.forEach(function (value, key, map) {
            value.OnDestroy();
        });
        this.ClearData();
    };
    ModeMgr.prototype.update = function (dt) {
        if (this.mIsLoginSendingFlag) {
            var isOk_1 = true;
            this.mModes.forEach(function (value, key, map) {
                if (!value.initMsgRespOk) {
                    isOk_1 = false;
                }
            });
            if (isOk_1) {
                this.DispatchEventByType(ModeMgr.EventType.SENDINITMSGOK);
                this.mIsLoginSendingFlag = false;
            }
        }
    };
    ModeMgr.EventType = {
        SENDINITMSGOK: "SENDINITMSGOK"
    };
    return ModeMgr;
}(DispatchEventNode_1.DispatchEventNode));
exports.ModeMgr = ModeMgr;
var IMode = /** @class */ (function () {
    function IMode() {
        this.initMsgRespOk = false;
        this.eventMgr = new EventListenerMgr_1.InterchangeableEventListenerMgr(this, this.OnHandler);
        this.eventMgr.setNetCallback(this.OnHandler, 99);
        this.eventMgr.setModeCallback(this.OnHandler, 99);
    }
    IMode.prototype.OnSendInitMsg = function () {
        this.initMsgRespOk = true;
    };
    /**
    * 处理消息
    * @param ev 参数
    */
    IMode.prototype.OnHandler = function (ev) {
    };
    IMode.prototype.OnDestroy = function () {
        this.eventMgr.RemoveAll();
    };
    return IMode;
}());
exports.IMode = IMode;
