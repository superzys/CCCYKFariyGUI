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
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var YK;
(function (YK) {
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
    YK.DispatchEventNode = DispatchEventNode;
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
    YK.EventData = EventData;
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
    YK.Func = Func;
})(YK || (YK = {}));
// import { DispatchEventNode, EventCallbackListener } from "./DispatchEventNode";
// import { NetMgr } from "../Net/NetMgr";
// import { SceneMgr } from "../SceneMgr/SceneMgr";
// import { UIMgr } from "../UIMgr/UIMgr";
// import { ModeMgr } from "../ModeMgr/ModeMgr";
var YK;
(function (YK) {
    var EventListenerMgr = /** @class */ (function () {
        function EventListenerMgr(dis) {
            if (dis === void 0) { dis = null; }
            this.mOwner = null;
            this.mListener = new Array();
            this.mOwner = dis;
        }
        /**
         *
         * @param callback 回调
         * @param thisObj 作用对象
         * @param type 消息类型
         * @param _priority 优先级
         * @param _dispatchOnce 是否只派发一次
         */
        EventListenerMgr.prototype.addListener = function (type, callback, thisObj, _priority, _dispatchOnce) {
            if (_priority === void 0) { _priority = 0; }
            if (_dispatchOnce === void 0) { _dispatchOnce = false; }
            if (this.mOwner.hasEventListener(type, callback, thisObj)) {
                console.warn("重复注册消息 消息id" + type);
            }
            else {
                var listener = EventListenerData.CreateEventListenerData(this.mOwner, callback, thisObj, type.toString(), _priority, _dispatchOnce);
                listener.AttachListener();
                this.mListener.push(listener);
            }
        };
        /**
         *
         * @param callback 回调
         * @param thisObj 作用对象
         * @param type 消息类型
         */
        EventListenerMgr.prototype.removeListener = function (callback, thisObj, type) {
            if (this.mOwner.hasEventListener(type, callback, thisObj)) {
                var listener_1 = null;
                var index = this.mListener.findIndex(function (value, index, array) {
                    if (value.thisObj == thisObj && value.callback == callback) {
                        listener_1 = value;
                        return true;
                    }
                    return false;
                });
                if (index != -1) {
                    listener_1.DetachListener();
                    this.mListener.splice(index, 1);
                }
            }
        };
        EventListenerMgr.prototype.removeAllListener = function () {
            this.mListener.forEach(function (listener) {
                listener.DetachListener();
            });
            this.mListener.splice(0, this.mListener.length);
        };
        return EventListenerMgr;
    }());
    YK.EventListenerMgr = EventListenerMgr;
    var InterchangeableEventListenerMgr = /** @class */ (function () {
        function InterchangeableEventListenerMgr(thisObj, defCallback) {
            if (defCallback === void 0) { defCallback = null; }
            this.otherEvents = new Array();
            this.networkEvnets = new EventListenerMgr(YK.NetMgr.Instance);
            this.sceneEvents = new EventListenerMgr(YK.SceneMgr.Instance);
            this.uiEvents = new EventListenerMgr(YK.UIMgr.Instance);
            this.modeEvents = new EventListenerMgr(YK.ModeMgr.Instance);
            this.mDefObj = thisObj;
            this.otherEvents = new Array();
            this.mDefCallback = new EventListenerData(YK.NetMgr.Instance, defCallback, thisObj, null);
            this.mNetCallback = new EventListenerData(YK.NetMgr.Instance, defCallback, thisObj, null);
            this.mModeCallback = new EventListenerData(YK.NetMgr.Instance, defCallback, thisObj, null);
            this.mSceneCallback = new EventListenerData(YK.NetMgr.Instance, defCallback, thisObj, null);
            this.mUICallback = new EventListenerData(YK.NetMgr.Instance, defCallback, thisObj, null);
        }
        InterchangeableEventListenerMgr.prototype.setDegCallback = function (callback, priority) {
            if (priority === void 0) { priority = 0; }
            this.mDefCallback.callback = callback;
            this.mDefCallback.priority = priority;
            return this;
        };
        InterchangeableEventListenerMgr.prototype.setNetCallback = function (callback, priority) {
            if (priority === void 0) { priority = 0; }
            this.mNetCallback.callback = callback;
            this.mNetCallback.priority = priority;
            return this;
        };
        InterchangeableEventListenerMgr.prototype.setModeCallback = function (callback, priority) {
            if (priority === void 0) { priority = 0; }
            this.mModeCallback.callback = callback;
            this.mModeCallback.priority = priority;
            return this;
        };
        InterchangeableEventListenerMgr.prototype.setSceneCallback = function (callback, priority) {
            if (priority === void 0) { priority = 0; }
            this.mSceneCallback.callback = callback;
            this.mSceneCallback.priority = priority;
            return this;
        };
        InterchangeableEventListenerMgr.prototype.setUICallback = function (callback, priority) {
            if (priority === void 0) { priority = 0; }
            this.mUICallback.callback = callback;
            this.mSceneCallback.priority = priority;
            return this;
        };
        InterchangeableEventListenerMgr.prototype.addListener = function (dis, type, callback, thisObj, _priority, _dispatchOnce) {
            if (callback === void 0) { callback = null; }
            if (thisObj === void 0) { thisObj = null; }
            if (_priority === void 0) { _priority = 0; }
            if (_dispatchOnce === void 0) { _dispatchOnce = false; }
            if (dis == YK.NetMgr.Instance)
                this.addNetEvent(type, callback, thisObj);
            else if (dis == YK.SceneMgr.Instance)
                this.addSceneEvent(type, callback, thisObj);
            else if (dis == YK.UIMgr.Instance)
                this.addUIEvent(type, callback, thisObj);
            else if (dis == YK.ModeMgr.Instance)
                this.addModeEvent(type, callback, thisObj);
            else {
                if (callback == null)
                    callback = this.mDefCallback.callback;
                if (thisObj == null)
                    thisObj = this.mDefCallback.thisObj;
                if (_priority == 0)
                    _priority = this.mDefCallback.priority;
                var x_1 = this.otherEvents.findIndex(function (value, index, obj) {
                    if (value.dis == dis && type == value.type
                        && callback != value.callback
                        && thisObj == value.thisObj) {
                        x_1 = index;
                        return true;
                    }
                    else {
                        return false;
                    }
                });
                if (x_1 != -1) {
                    var data = EventListenerData.CreateEventListenerData(dis, callback, this, type.toString(), _priority, _dispatchOnce);
                    data.AttachListener();
                    this.otherEvents.push(data);
                }
            }
        };
        InterchangeableEventListenerMgr.prototype.removeListener = function (dis, type, callback, thisObj) {
            if (callback === void 0) { callback = null; }
            if (thisObj === void 0) { thisObj = null; }
            if (dis == YK.NetMgr.Instance)
                this.removeNetEvent(type, callback, thisObj);
            else if (dis == YK.SceneMgr.Instance)
                this.removeSceneEvent(type, callback, thisObj);
            else if (dis == YK.UIMgr.Instance)
                this.removeUIEvent(type, callback, thisObj);
            else if (dis == YK.ModeMgr.Instance)
                this.removeModeEvent(type, callback, thisObj);
            else {
                if (callback == null)
                    callback = this.mDefCallback.callback;
                if (thisObj == null)
                    thisObj = this.mDefCallback.callback;
                var x_2 = this.otherEvents.findIndex(function (value, index, obj) {
                    if (value.dis == dis && type == value.type
                        && callback != value.callback
                        && thisObj == value.thisObj) {
                        x_2 = index;
                        return true;
                    }
                    else {
                        return false;
                    }
                });
                if (x_2 != -1) {
                    this.otherEvents[x_2].DetachListener();
                    this.otherEvents.splice(x_2, 1);
                }
            }
        };
        InterchangeableEventListenerMgr.prototype.addNetEvent = function (type, callback, thisObj, _priority, _dispatchOnce) {
            if (callback === void 0) { callback = null; }
            if (thisObj === void 0) { thisObj = null; }
            if (_priority === void 0) { _priority = 0; }
            if (_dispatchOnce === void 0) { _dispatchOnce = false; }
            if (callback == null) {
                callback = this.mNetCallback.callback;
                thisObj = this.mNetCallback.thisObj;
            }
            if (_priority == 0) {
                _priority = this.mNetCallback.priority;
            }
            this.networkEvnets.addListener(type, callback, thisObj, _priority, _dispatchOnce);
        };
        InterchangeableEventListenerMgr.prototype.removeNetEvent = function (type, callback, thisObj) {
            if (callback === void 0) { callback = null; }
            if (thisObj === void 0) { thisObj = null; }
            if (callback == null) {
                callback = this.mNetCallback.callback;
                thisObj = this.mDefCallback.thisObj;
            }
            this.networkEvnets.removeListener(callback, thisObj, type);
        };
        InterchangeableEventListenerMgr.prototype.addUIEvent = function (type, callback, thisObj, _priority, _dispatchOnce) {
            if (callback === void 0) { callback = null; }
            if (thisObj === void 0) { thisObj = null; }
            if (_priority === void 0) { _priority = 0; }
            if (_dispatchOnce === void 0) { _dispatchOnce = false; }
            if (callback == null) {
                callback = this.mUICallback.callback;
                thisObj = this.mUICallback.thisObj;
            }
            if (_priority == 0) {
                _priority = this.mUICallback.priority;
            }
            this.uiEvents.addListener(type, callback, thisObj, _priority, _dispatchOnce);
        };
        InterchangeableEventListenerMgr.prototype.removeUIEvent = function (type, callback, thisObj) {
            if (callback === void 0) { callback = null; }
            if (thisObj === void 0) { thisObj = null; }
            if (callback == null) {
                callback = this.mUICallback.callback;
                thisObj = this.mUICallback.thisObj;
            }
            this.uiEvents.removeListener(callback, thisObj, type);
        };
        InterchangeableEventListenerMgr.prototype.addSceneEvent = function (type, callback, thisObj, _priority, _dispatchOnce) {
            if (callback === void 0) { callback = null; }
            if (thisObj === void 0) { thisObj = null; }
            if (_priority === void 0) { _priority = 0; }
            if (_dispatchOnce === void 0) { _dispatchOnce = false; }
            if (callback == null) {
                callback = this.mSceneCallback.callback;
                thisObj = this.mSceneCallback.thisObj;
            }
            if (_priority == 0) {
                _priority = this.mUICallback.priority;
            }
            this.sceneEvents.addListener(type, callback, thisObj, _priority, _dispatchOnce);
        };
        InterchangeableEventListenerMgr.prototype.removeSceneEvent = function (type, callback, thisObj) {
            if (callback === void 0) { callback = null; }
            if (thisObj === void 0) { thisObj = null; }
            if (callback == null) {
                callback = this.mSceneCallback.callback;
                thisObj = this.mSceneCallback.thisObj;
            }
            this.sceneEvents.removeListener(callback, thisObj, type);
        };
        InterchangeableEventListenerMgr.prototype.addModeEvent = function (type, callback, thisObj, _priority, _dispatchOnce) {
            if (callback === void 0) { callback = null; }
            if (thisObj === void 0) { thisObj = null; }
            if (_priority === void 0) { _priority = 0; }
            if (_dispatchOnce === void 0) { _dispatchOnce = false; }
            if (callback == null) {
                callback = this.mModeCallback.callback;
                thisObj = this.mModeCallback.thisObj;
            }
            this.modeEvents.addListener(type, callback, thisObj);
        };
        InterchangeableEventListenerMgr.prototype.removeModeEvent = function (type, callback, thisObj) {
            if (callback === void 0) { callback = null; }
            if (thisObj === void 0) { thisObj = null; }
            if (callback == null) {
                callback = this.mModeCallback.callback;
                thisObj = this.mModeCallback.thisObj;
            }
            this.modeEvents.removeListener(callback, thisObj, type);
        };
        InterchangeableEventListenerMgr.prototype.RemoveAll = function () {
            if (this.networkEvnets != null)
                this.networkEvnets.removeAllListener();
            if (this.sceneEvents != null)
                this.sceneEvents.removeAllListener();
            if (this.uiEvents != null)
                this.uiEvents.removeAllListener();
            if (this.modeEvents != null)
                this.modeEvents.removeAllListener();
            this.otherEvents.forEach(function (element) {
                element.DetachListener();
            });
            this.otherEvents.splice(0, this.otherEvents.length);
        };
        return InterchangeableEventListenerMgr;
    }());
    YK.InterchangeableEventListenerMgr = InterchangeableEventListenerMgr;
    var EventListenerData = /** @class */ (function () {
        function EventListenerData(dis, callback, thisObj, type, _priority, _dispatchOnce) {
            if (_priority === void 0) { _priority = 0; }
            if (_dispatchOnce === void 0) { _dispatchOnce = false; }
            this.dispatchOnce = false;
            this.dis = dis;
            this.thisObj = thisObj;
            this.type = type;
            this.callback = callback;
            this.priority = _priority;
            this.dispatchOnce = _dispatchOnce;
            // this.AttachListener()
        }
        EventListenerData.CreateEventListenerData = function (dis, callback, thisObj, type, _priority, _dispatchOnce) {
            if (_priority === void 0) { _priority = 0; }
            if (_dispatchOnce === void 0) { _dispatchOnce = false; }
            var listener = null;
            if (this.mEventListenerData.length > 0) {
                listener = this.mEventListenerData.pop();
                listener.dis = dis;
                listener.callback = callback;
                listener.thisObj = thisObj;
                listener.type = type;
                listener;
            }
            else {
                listener = new EventListenerData(dis, callback, thisObj, type, _priority, _dispatchOnce);
            }
            return listener;
        };
        EventListenerData.ReturnEventListenerData = function (listener) {
            if (listener) {
                listener.dis.removeEventListener(listener.type, listener.callback, listener.thisObj);
                listener.dis = null;
                listener.callback = null;
                listener.thisObj = null;
                listener.type = null;
                this.mEventListenerData.push(listener);
            }
        };
        EventListenerData.prototype.AttachListener = function () {
            if (this.dis.hasEventListener(this.type, this.callback, this.thisObj)) {
                this.DetachListener();
                return false;
            }
            this.dis.addEventListener(this.type, this.callback, this.thisObj, this.priority, this.dispatchOnce);
            return true;
        };
        EventListenerData.prototype.DetachListener = function () {
            EventListenerData.ReturnEventListenerData(this);
        };
        EventListenerData.mEventListenerData = new Array();
        return EventListenerData;
    }());
    YK.EventListenerData = EventListenerData;
})(YK || (YK = {}));
// import { DispatchEventNode, EventData } from "../EventMgr/DispatchEventNode";
// import { EventListenerMgr, InterchangeableEventListenerMgr } from "../EventMgr/EventListenerMgr";
var YK;
(function (YK) {
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
    }(YK.DispatchEventNode));
    YK.ModeMgr = ModeMgr;
    var IMode = /** @class */ (function () {
        function IMode() {
            this.initMsgRespOk = false;
            this.eventMgr = new YK.InterchangeableEventListenerMgr(this, this.OnHandler);
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
    YK.IMode = IMode;
})(YK || (YK = {}));
// import { ResponseMessageEvent } from "./ResponseMessageEvent";
// import { PackBase } from "./PackBase";
// import { ProtoMap } from "./ProtoMap";
// import { TimeDelay } from "../Util/TimeDelay";
// import { DispatchEventNode, Func } from "../EventMgr/DispatchEventNode";
var YK;
(function (YK) {
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var NetMgr = /** @class */ (function (_super) {
        __extends(NetMgr, _super);
        function NetMgr() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.httpUrl = "http://39.107.84.87:9100/?";
            _this.mTimeout = 10; //默认十秒
            _this.mHeartTimeout = 10;
            _this.pbkill = null; //require("./pbkiller/src/pbkiller")
            _this.ip = 'ws://39.107.84.87:9023';
            _this.socket = null;
            _this.mIsConnect = false;
            _this.mMsgId = 0;
            _this.mSendQueue = new Array();
            return _this;
        }
        Object.defineProperty(NetMgr, "Instance", {
            get: function () {
                if (this.mInstance == null) {
                    var no = new cc.Node("netMgr");
                    cc.game.addPersistRootNode(no);
                    this.mInstance = no.addComponent(NetMgr);
                }
                return this.mInstance;
            },
            enumerable: true,
            configurable: true
        });
        NetMgr.prototype.start = function () {
            YK.TimeDelay.Instance.Add(1, 0, this.CheckSendTimeOut, this);
        };
        NetMgr.prototype.onDestroy = function () {
            YK.TimeDelay.Instance.Remove(this.CheckSendTimeOut, this);
        };
        NetMgr.prototype.update = function (dt) {
        };
        NetMgr.prototype.init = function (callBack) {
            this.pbkill.preload(function () {
                if (callBack) {
                    callBack();
                }
            });
        };
        NetMgr.prototype.CheckSendTimeOut = function () {
            var _this = this;
            if (this.mSendQueue.length > 0) {
                var array_1 = new Array();
                this.mSendQueue.forEach(function (element) {
                    if (Date.now() - element.sendTime > _this.mTimeout * 1000) {
                        array_1.push(element);
                    }
                });
                array_1.forEach(function (element) {
                    var index = _this.mSendQueue.indexOf(element);
                    if (index != -1) {
                        _this.mSendQueue.splice(index, 1);
                    }
                    _this.msgTimeOut(element.head);
                });
            }
        };
        NetMgr.prototype.AddProto = function (pbName, protoNames) {
            for (var key in protoNames) {
                var protoName = protoNames[key];
                var _class = this.pbkill.loadFromFile(pbName, protoName);
                YK.ProtoMap.Add(protoName, _class);
            }
        };
        NetMgr.prototype.connect = function (wsurl) {
            if (wsurl === void 0) { wsurl = null; }
            wsurl = wsurl == null ? this.ip : wsurl;
            if (this.socket == null) {
                this.socket = new WebSocket(wsurl);
                this.socket.binaryType = "arraybuffer";
                this.socket.onopen = this.onopen.bind(this);
                this.socket.onerror = this.onerror.bind(this);
                this.socket.onmessage = this.onmessage.bind(this);
                this.socket.onclose = this.onclose.bind(this);
            }
            else {
                if (this.socket.readyState == WebSocket.OPEN) {
                    this.onopen(null);
                }
                else {
                    this.socket = new WebSocket(wsurl);
                    this.socket.binaryType = "arraybuffer";
                    this.socket.onopen = this.onopen.bind(this);
                    this.socket.onerror = this.onerror.bind(this);
                    this.socket.onmessage = this.onmessage.bind(this);
                    this.socket.onclose = this.onclose.bind(this);
                }
            }
        };
        NetMgr.prototype.onopen = function (ev) {
            YK.TimeDelay.Instance.Remove(this.sendHeartbeat, this);
            YK.TimeDelay.Instance.Remove(this.checkHeartbeat, this);
            YK.TimeDelay.Instance.Add(3, 0, this.sendHeartbeat, this);
            YK.TimeDelay.Instance.Add(3, 0, this.checkHeartbeat, this);
            this.mIsConnect = true;
            this.lastActivityTime = Date.now();
            this.DispatchEventByType(NetMgrEventDef.onopen);
        };
        NetMgr.prototype.isConnect = function () {
            return this.socket != null && this.mIsConnect;
        };
        NetMgr.prototype.disConnect = function (msgType, msg) {
            if (this.mSendQueue) {
                this.mSendQueue.splice(0, this.mSendQueue.length);
            }
            if (this.isConnect()) {
                this.mIsConnect = false;
                this.socket.close();
            }
            else {
                this.mIsConnect = false;
            }
            this.socket = null;
            YK.TimeDelay.Instance.Remove(this.sendHeartbeat, this);
            YK.TimeDelay.Instance.Remove(this.checkHeartbeat, this);
            var data = { type: msgType, msg: msg };
            this.DispatchEventByType(NetMgrEventDef.disConnect, data);
        };
        NetMgr.prototype.onerror = function (ev) {
            this.disConnect(NetMgrEventDef.onerror, "与服务器连接失败");
        };
        NetMgr.prototype.onclose = function (ev) {
            this.disConnect(NetMgrEventDef.onclose, "与服务器连接断开");
        };
        NetMgr.prototype.onmessage = function (ev) {
            var data = ev.data;
            var head;
            //try 
            {
                head = YK.ProtoMap.UnPackHead(data);
                if (head != null) {
                    this.lastActivityTime = Date.now();
                    if (head.cmd != 1) {
                        this.distributeMsg(head);
                    }
                    else {
                        //console.log("收到心跳包")
                    }
                }
                else {
                    console.error("协议解析失败");
                }
            } //catch (error) 
            // {
            //     console.error("协议解析失败")
            //     this.disConnect("onerror","解析消息失败")
            // }
        };
        Object.defineProperty(NetMgr.prototype, "Msgid", {
            get: function () {
                return this.mMsgId++;
            },
            enumerable: true,
            configurable: true
        });
        NetMgr.prototype.sendHeartbeat = function () {
            if (this.isConnect()) {
                //console.log("发送一次心跳" + Date.now())
                this.Send(1);
            }
        };
        NetMgr.prototype.checkHeartbeat = function () {
            if (Date.now() - this.lastActivityTime > 10 * 1000) {
                this.disConnect(NetMgrEventDef.HeartbeatTimeOut, "与服务器连接超时");
            }
        };
        NetMgr.prototype.msgTimeOut = function (head) {
            if (head.cmd == 1) {
                this.disConnect(NetMgrEventDef.HeartbeatTimeOut, "与服务器连接超时");
            }
            else {
                var ev = new YK.ResponseMessageEvent(head.cmd.toString());
                head.errorcode = -1;
                ev.SetData(head, null);
                console.error("消息返回超时id=" + head.cmd);
                this.node.dispatchEvent(ev);
            }
        };
        NetMgr.prototype.SendGet = function (url, callback) {
            url = this.httpUrl + url;
            console.log(url);
            var flag = false;
            var request = cc.loader.getXMLHttpRequest();
            request.open("GET", url, true);
            request.timeout = 5000;
            request.onreadystatechange = function () {
                if (request.readyState === 4 && (request.status == 200 && request.status < 300)) {
                    var respone = request.responseText;
                    var data = null;
                    try {
                        if (respone != null) {
                            data = JSON.parse(respone);
                        }
                    }
                    catch (error) {
                        console.error("请求发生错误：url=" + url + "//error=" + error);
                    }
                    console.log("请求登录返回成功");
                    callback.Invoke(data);
                }
            };
            request.onerror = function (ev) {
                console.error("请求发生错误：url=" + url);
                callback.Invoke(null);
            };
            request.ontimeout = function (e) {
                console.error("请求超时：url=" + url);
                callback.Invoke(null);
            };
            request.send();
        };
        NetMgr.prototype.Send = function (id, data) {
            if (data === void 0) { data = null; }
            var head = new YK.PackBase();
            head.cmd = id;
            head.errorcode = 0;
            head.msgid = this.Msgid;
            var sendData = {
                head: head,
                sendTime: Date.now()
            };
            if (this.isConnect()) {
                var buffer = YK.ProtoMap.Pack(head, data);
                if (id != 1) {
                    console.log("发送消息给服务器》");
                    console.log(head);
                    console.log(data);
                    this.mSendQueue.push(sendData);
                }
                this.socket.send(buffer);
            }
            else {
                console.error("网络断开无法发送消息");
            }
        };
        NetMgr.prototype.distributeMsg = function (head) {
            var msg = YK.ProtoMap.UnPack(head);
            console.log("收到服务返回的消息信息头：");
            console.log(head);
            if (head.errorcode != null && head.errorcode != 0) {
                console.warn("服务器返回错误码  消息id：" + head.cmd + "/errorcode=" + head.errorcode);
            }
            if (head == null || head.cmd == null) {
                console.warn("服务器返回无效的cmdid");
            }
            else {
                var index = this.mSendQueue.findIndex(function (obj, index, any) {
                    return obj.head.msgid == head.msgid && obj.head.cmd == head.cmd;
                });
                if (index != -1) {
                    this.mSendQueue.splice(index, 1);
                }
                var ev = new YK.ResponseMessageEvent(head.cmd.toString());
                ev.SetData(head, msg);
                this.DispatchEvent(ev);
            }
        };
        __decorate([
            property
        ], NetMgr.prototype, "ip", void 0);
        return NetMgr;
    }(YK.DispatchEventNode));
    YK.NetMgr = NetMgr;
    var NetMgrEventDef = /** @class */ (function () {
        function NetMgrEventDef() {
        }
        NetMgrEventDef.disConnect = "disConnect";
        NetMgrEventDef.onerror = "onerror";
        NetMgrEventDef.onclose = "onclose";
        NetMgrEventDef.onopen = "onopen";
        NetMgrEventDef.HeartbeatTimeOut = "HeartbeatTimeOut";
        return NetMgrEventDef;
    }());
    YK.NetMgrEventDef = NetMgrEventDef;
})(YK || (YK = {}));
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var YK;
(function (YK) {
    var PackBase = /** @class */ (function () {
        function PackBase() {
            this.cmd = 0;
            this.msgid = 0;
            this.errorcode = 0;
            this.contentBuff = null;
        }
        return PackBase;
    }());
    YK.PackBase = PackBase;
})(YK || (YK = {}));
// import { PackBase } from "./PackBase";
var YK;
(function (YK) {
    var ProtoMap = /** @class */ (function () {
        function ProtoMap() {
        }
        ProtoMap.Add = function (key, type) {
            this.classMap[key] = type;
        };
        ProtoMap.Pack = function (head, data) {
            if (data === void 0) { data = null; }
            var proto = this.protos[head.cmd];
            if (proto == null) {
                console.error("尝试封包一个没有注册的消息 id=" + head.cmd);
                return null;
            }
            var _c = proto.request;
            if (_c != null && data != null) {
                head.contentBuff = this.PackByClasName(_c, data);
            }
            return this.PackByClasName("packbase", head);
        };
        ProtoMap.UnPack = function (head, buff) {
            if (buff === void 0) { buff = null; }
            var proto = this.protos[head.cmd];
            if (proto == null) {
                console.error("尝试解包一个没有注册的消息 id=" + head.cmd);
                return null;
            }
            var _c = proto.response;
            if (_c != null) {
                buff = buff == null ? head.contentBuff : buff;
                return this.UnPackByClasName(_c, buff);
            }
            else {
                return null;
            }
        };
        ProtoMap.UnPackHead = function (buffer) {
            if (buffer == null || buffer.byteLength == 0)
                return null;
            return this.UnPackByClasName("packbase", buffer);
        };
        ProtoMap.PackByClasName = function (cname, data) {
            var c = this.classMap[cname];
            if (c != null) {
                var obj = new c(data);
                return obj.toArrayBuffer();
            }
            else {
                console.error("反序列化一条没有实现的消息id：" + cname);
            }
            return null;
        };
        ProtoMap.UnPackByClasName = function (cname, buff) {
            var c = this.classMap[cname];
            if (c != null && buff != null) {
                return c.decode(buff);
            }
            if (c == null) {
                console.error("反序列化一条没有实现的消息id：" + cname);
            }
            return null;
        };
        ProtoMap.AddProto = function (proto) {
            if (this.protos[proto.id] != null) {
                console.log(this.protos);
                console.error("不能重复注册消息  id=" + proto.id);
            }
            this.protos[proto.id] = proto;
        };
        ProtoMap.protos = {
            1: {
                id: 1,
                request: null,
                response: null,
            },
        };
        ProtoMap.classMap = {};
        return ProtoMap;
    }());
    YK.ProtoMap = ProtoMap;
})(YK || (YK = {}));
// import { EventData } from "../EventMgr/DispatchEventNode";
// import { PackBase } from "./PackBase";
var YK;
(function (YK) {
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
    }(YK.EventData));
    YK.ResponseMessageEvent = ResponseMessageEvent;
})(YK || (YK = {}));
// import { DispatchEventNode, Func } from "../EventMgr/DispatchEventNode";
var YK;
(function (YK) {
    var ResInfo = /** @class */ (function () {
        function ResInfo() {
            this.isKeepMemory = false;
            this.isFGUIPack = false;
        }
        Object.defineProperty(ResInfo.prototype, "fullUrl", {
            get: function () {
                if (this.isFGUIPack) {
                    return this.url.replace("." + "bin", "");
                }
                return this.url;
            },
            enumerable: true,
            configurable: true
        });
        return ResInfo;
    }());
    var LoadGruopInfo = /** @class */ (function () {
        function LoadGruopInfo() {
            this.Progress = 0;
            this.needLoad = new Array();
        }
        LoadGruopInfo.prototype.add = function (url, isKeepMemory, isFGUIPack) {
            if (isKeepMemory === void 0) { isKeepMemory = false; }
            if (isFGUIPack === void 0) { isFGUIPack = false; }
            var index = this.needLoad.findIndex(function (value, index, obj) {
                return value.url == url;
            });
            if (index == -1) {
                var info = new ResInfo();
                info.isKeepMemory = isKeepMemory;
                info.url = url;
                info.isFGUIPack = isFGUIPack;
                this.needLoad.push(info);
            }
            return this;
        };
        LoadGruopInfo.prototype.onCompletion = function (callback, thisObjs) {
            this.finish = new YK.Func(thisObjs, callback);
            return this;
        };
        LoadGruopInfo.prototype.onItemCompletion = function (callback, thisObjs) {
            this.loadItem = new YK.Func(thisObjs, callback);
            return this;
        };
        LoadGruopInfo.prototype.start = function () {
            ResMgr.Instance.LoadGroup(this);
        };
        return LoadGruopInfo;
    }());
    YK.LoadGruopInfo = LoadGruopInfo;
    var ResMgr = /** @class */ (function (_super) {
        __extends(ResMgr, _super);
        function ResMgr() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.mOldRes = new Array();
            _this.resDic = new Map();
            return _this;
        }
        Object.defineProperty(ResMgr, "Instance", {
            get: function () {
                if (this.mInstance == null) {
                    var no = new cc.Node("ResMgr");
                    cc.game.addPersistRootNode(no);
                    this.mInstance = no.addComponent(ResMgr);
                }
                return this.mInstance;
            },
            enumerable: true,
            configurable: true
        });
        ResMgr.prototype.GetRes = function (url) {
            return cc.loader.getRes(url);
        };
        ResMgr.prototype.LoadGroup = function (loads) {
            var _this = this;
            var urls = new Array();
            loads.needLoad.forEach(function (element) {
                urls.push(element.url);
            });
            cc.loader.loadResArray(urls, function (completedCount, totalCount, item) {
                loads.Progress = completedCount / totalCount * 100;
                if (loads.loadItem != null) {
                    loads.loadItem.Invoke(completedCount, totalCount, item);
                }
            }, (function (error, resource) {
                if (error == null) {
                    for (var index = 0; index < resource.length; index++) {
                        var element = resource[index];
                        var info = loads.needLoad[index];
                        info.asset = element;
                        if (info.isFGUIPack) {
                            fgui.UIPackage.addPackage(info.fullUrl);
                        }
                        if (!_this.resDic.has(info.url)) {
                            _this.resDic.set(info.url, info);
                        }
                    }
                }
                else {
                    console.error(error);
                }
                if (loads.finish != null) {
                    loads.finish.Invoke(error);
                }
            }));
        };
        /**
         * 释放资源
         * @param forced 是否强制释放所有
         */
        ResMgr.prototype.pop = function (forced) {
            var _this = this;
            if (forced === void 0) { forced = false; }
            if (forced) {
                this.mOldRes.splice(0, this.mOldRes.length);
                this.resDic.forEach(function (v, key) {
                    _this.mOldRes.push(key);
                });
                this.resDic.clear();
            }
            else {
                this.mOldRes.forEach(function (element) {
                    _this.resDic.delete(element);
                });
            }
            while (this.mOldRes.length > 0) {
                var url = this.mOldRes.pop();
                var info = this.resDic.get(url);
                if (info != null) {
                    if (info.isFGUIPack)
                        fgui.UIPackage.removePackage(info.url);
                    this.resDic.delete(info.url);
                }
                cc.loader.release(url);
            }
        };
        /**
         * 压入要释放的资源
         */
        ResMgr.prototype.push = function () {
            var _this = this;
            this.resDic.forEach(function (v, key) {
                if (!v.isKeepMemory)
                    _this.mOldRes.push(key);
            });
        };
        ResMgr.mInstance = null;
        return ResMgr;
    }(YK.DispatchEventNode));
    YK.ResMgr = ResMgr;
})(YK || (YK = {}));
// import { EventListenerMgr, EventListenerData, InterchangeableEventListenerMgr } from "../EventMgr/EventListenerMgr";
// import { ResMgr, LoadGruopInfo } from "../ResMgr/ResMgr";
// import { TaskMgr } from "../Task/TaskBase";
// import { Func, DispatchEventNode, EventData, EventCallbackListener } from "../EventMgr/DispatchEventNode";
// import { UIMgr } from "../UIMgr/UIMgr";
// import { NetMgr } from "../Net/NetMgr";
// import { SceneMgr } from "./SceneMgr";
// import { ModeMgr } from "../ModeMgr/ModeMgr";
var YK;
(function (YK) {
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    // @ccclass
    var SceneBase = /** @class */ (function () {
        function SceneBase() {
            this.firstWind = null;
            this.mLoaded = false;
            this.mTaskFinished = false;
            this.needLoadRes = new YK.LoadGruopInfo();
            this.needLoadRes.onCompletion(this.Loaded, this);
            this.tasks = new YK.TaskMgr(true, new YK.Func(this, this.TaskFinished));
            this.eventMgr = new YK.InterchangeableEventListenerMgr(this, this.OnHandler);
        }
        SceneBase.prototype.Enter = function (param) {
            YK.ResMgr.Instance.push();
            //UIMgr.Instance.HideAllWind()
            this.mLoaded = false;
            this.mTaskFinished = false;
            this.tasks.Stop();
            this.mParam = param;
            this.OnInit(param);
            this.needLoadRes.start();
            this.tasks.Execute();
        };
        SceneBase.prototype.Leave = function () {
            if (this.eventMgr != null)
                this.eventMgr.RemoveAll();
            if (this.tasks != null)
                this.tasks.Stop();
            this.OnLeave();
        };
        SceneBase.prototype.Destroy = function () {
            this.OnDestroy();
        };
        /**
         * 任务完成
         * @param error 错误
         */
        SceneBase.prototype.TaskFinished = function (error) {
            if (error != null) {
                console.error(error);
            }
            else {
                this.OnTaskFinished();
                this.mTaskFinished = true;
                this.ChechEnter();
            }
        };
        /**
         * 加载完成
         * @param error 加载错误
         */
        SceneBase.prototype.Loaded = function (error) {
            if (error != null) {
                console.error(error);
            }
            else {
                this.OnLoaded();
                this.mLoaded = true;
                this.ChechEnter();
            }
        };
        SceneBase.prototype.ChechEnter = function () {
            if (this.mLoaded && this.mTaskFinished) {
                YK.UIMgr.Instance.HideAllWind(true);
                YK.ResMgr.Instance.pop();
                if (this.firstWind != null) {
                    YK.UIMgr.Instance.ShowWind(this.firstWind);
                }
                this.OnEnter(this.mParam);
            }
        };
        /**
         * 加载完成
         */
        SceneBase.prototype.OnLoaded = function () {
        };
        /**
         * 任务完成
         */
        SceneBase.prototype.OnTaskFinished = function () {
        };
        /**
        * 处理消息
        * @param ev 参数
        */
        SceneBase.prototype.OnHandler = function (ev) {
        };
        /**
        * 场景初始化
        * @param param 参数
        */
        SceneBase.prototype.OnInit = function (param) {
        };
        /**
         * 进入场景
         */
        SceneBase.prototype.OnEnter = function (param) {
        };
        /**
         * 离开场景
         */
        SceneBase.prototype.OnLeave = function () {
        };
        /**
         * 当场景被销毁的时候
         */
        SceneBase.prototype.OnDestroy = function () {
        };
        return SceneBase;
    }());
    YK.SceneBase = SceneBase;
})(YK || (YK = {}));
// import { SceneBase } from "./SceneBase";
// import { DispatchEventNode } from "../EventMgr/DispatchEventNode";
var YK;
(function (YK) {
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    // @ccclass
    var SceneMgr = /** @class */ (function (_super) {
        __extends(SceneMgr, _super);
        function SceneMgr() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.mScenes = new Map();
            _this.mCurScene = null;
            return _this;
        }
        Object.defineProperty(SceneMgr, "Instance", {
            get: function () {
                if (this.mInstance == null) {
                    var no = new cc.Node("SceneMgr");
                    cc.game.addPersistRootNode(no);
                    this.mInstance = no.addComponent(SceneMgr);
                }
                return this.mInstance;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 跳转场景
         * @param type 场景脚本文件
         * @param param 参数
         */
        SceneMgr.prototype.GoToScene = function (script, param) {
            if (param === void 0) { param = null; }
            if (!this.mScenes.has(script)) {
                if (this.mCurScene != null) {
                    this.mCurScene.Leave();
                }
                var scene = new script();
                this.mScenes.set(script, scene);
                this.mCurScene = scene;
                this.mCurScene.Enter(param);
            }
            else {
                var scene = this.mScenes.get(script);
                if (scene == this.mCurScene) {
                    console.error("当前场景与目标场景一样无法重新进入这个场景");
                    return;
                }
                else {
                    if (this.mCurScene != null) {
                        this.mCurScene.Leave();
                        this.mCurScene = this.mScenes.get(script);
                        this.mCurScene.Enter(param);
                    }
                }
            }
        };
        //private mBolckBg : cc.Node = null
        SceneMgr.mInstance = null;
        return SceneMgr;
    }(YK.DispatchEventNode));
    YK.SceneMgr = SceneMgr;
})(YK || (YK = {}));
// import { TimeDelay } from "../Util/TimeDelay";
// import { Func } from "../EventMgr/DispatchEventNode";
var YK;
(function (YK) {
    /**
     * 任务管理器
     */
    var TaskMgr = /** @class */ (function () {
        function TaskMgr(failureStop, finished) {
            /**
             * 任务数
             */
            this.mTaskNum = 0;
            /**
             * 遇到错误是否停止
             */
            this.mFailureStop = true;
            /**
             * 并行任务
             */
            this.mParallelTask = new Array();
            /**
             * 顺序任务
             */
            this.mSequence = new Array();
            /**
             * 是否在执行任务
             */
            this.mIsRuning = false;
            /**
            * 任务进度
            */
            this.progress = 0;
            /**
             * 当前任务
             */
            this.currentTask = null;
            /**
             * 当前任务是否完成
             */
            this.isFinished = false;
            this.mFinished = finished;
            this.mParallelTask.splice(0, this.mParallelTask.length);
            this.mSequence.splice(0, this.mSequence.length);
            YK.TimeDelay.Instance.Remove(this.Update, this);
            YK.TimeDelay.Instance.AddUpdate(this.Update, this);
        }
        /**
         * 添加一个任务
         * @param task 任务对象
         * @param isSequence 是否是需要时序
         * @return 任务id -1则为添加失败
         */
        TaskMgr.prototype.AddTask = function (task, isSequence) {
            if (isSequence === void 0) { isSequence = true; }
            var array;
            var ret = -1;
            if (isSequence) {
                array = this.mSequence;
            }
            else {
                array = this.mParallelTask;
            }
            var index = array.findIndex(function (value, index, obj) {
                return value == task;
            });
            if (index == -1) {
                task.Id = this.mTaskNum;
                ret = task.Id;
                array.push(task);
                this.mTaskNum = this.mSequence.length + this.mParallelTask.length;
            }
            return ret;
        };
        TaskMgr.prototype.Update = function () {
            if (!this.mIsRuning) {
                return;
            }
            this.OnUpdate();
        };
        TaskMgr.prototype.OnUpdate = function () {
            for (var index = 0; index < this.mParallelTask.length; index++) {
                var element = this.mParallelTask[index];
                if (element.IsRuning && element.IsDone) {
                    this.mParallelTask.splice(index, 1);
                    index--;
                    this.progress = (this.mTaskNum - (this.mSequence.length + this.mParallelTask.length)) / this.mTaskNum * 100;
                    var error = element.Error;
                    if (error != null && this.mFailureStop) {
                        this.Finished(error);
                    }
                    else {
                        if (this.mTaskItemFinished) {
                            this.mTaskItemFinished.Invoke(element, this.progress);
                        }
                    }
                }
                else if (!element.IsRuning && !element.IsDone) {
                    element.OnExecute();
                    this.currentTask = element;
                }
            }
            for (var index = 0; index < this.mSequence.length; index++) {
                var element = this.mSequence[index];
                if (element.IsRuning) {
                    if (element.IsDone) {
                        this.mSequence.splice(index, 1);
                        index--;
                        var error = element.Error;
                        if (error != null && this.mFailureStop) {
                            this.Finished(error);
                        }
                        else {
                            this.progress = (this.mTaskNum - (this.mSequence.length + this.mParallelTask.length)) / this.mTaskNum * 100;
                            if (this.mTaskItemFinished) {
                                this.mTaskItemFinished.Invoke(element, this.progress);
                            }
                        }
                    }
                    break;
                }
                else if (!element.IsDone) {
                    this.currentTask = element;
                    element.OnExecute();
                }
            }
            if (this.mSequence.length + this.mParallelTask.length <= 0) {
                this.Finished();
            }
        };
        TaskMgr.prototype.Finished = function (error) {
            if (error === void 0) { error = null; }
            this.isFinished = true;
            this.mIsRuning = false;
            this.progress = 100;
            if (this.mFinished != null) {
                this.mFinished.Invoke(error);
            }
            if (error) {
                YK.TimeDelay.Instance.Remove(this.Update, this);
            }
        };
        /**
         *
         * @param id 任务id
         */
        TaskMgr.prototype.HasTask = function (id) {
            var index = this.mSequence.findIndex(function (value, index, obj) {
                return value.Id == id;
            });
            index = this.mParallelTask.findIndex(function (value, index, obj) {
                return value.Id == id;
            });
            return index != -1;
        };
        TaskMgr.prototype.Stop = function () {
            this.mIsRuning = false;
            //TimeDelay.Instance.Remove(this.Update, this)
        };
        TaskMgr.prototype.Execute = function () {
            this.mIsRuning = true;
        };
        return TaskMgr;
    }());
    YK.TaskMgr = TaskMgr;
    /**
     * 任务基类
     */
    var TaskBase = /** @class */ (function () {
        function TaskBase() {
            this.IsRuning = false;
            this.Id = 0;
            this.IsDone = false;
            this.Error = null;
        }
        TaskBase.prototype.TaskName = function () {
            return null;
        };
        TaskBase.prototype.OnExecute = function () {
            this.IsRuning = true;
        };
        TaskBase.prototype.Reset = function () {
            this.IsRuning = false;
        };
        return TaskBase;
    }());
    YK.TaskBase = TaskBase;
})(YK || (YK = {}));
// import { DispatchEventNode, EventData } from "../EventMgr/DispatchEventNode";
// import { EventListenerMgr, InterchangeableEventListenerMgr } from "../EventMgr/EventListenerMgr";
// import { ResMgr } from "../ResMgr/ResMgr";
// import { NetMgr } from "../Net/NetMgr";
// import { SceneMgr } from "../SceneMgr/SceneMgr";
// import { ModeMgr } from "../ModeMgr/ModeMgr";
var YK;
(function (YK) {
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var UIConfig = /** @class */ (function () {
        function UIConfig() {
        }
        UIConfig.modalLayerColor = new cc.Color(0, 0, 0, 0.4 * 255); //默认显示背景颜色
        UIConfig.globalModalWaiting = null; //等待界面
        UIConfig.autoCloseWaitingTime = 10; //自动关闭等待界面的时间
        return UIConfig;
    }());
    YK.UIConfig = UIConfig;
    // @ccclass
    var UIMgr = /** @class */ (function (_super) {
        __extends(UIMgr, _super);
        function UIMgr() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.mWinds = new Map();
            _this.modalWaitPane = null;
            return _this;
        }
        Object.defineProperty(UIMgr, "Instance", {
            get: function () {
                if (this.mInstance == null) {
                    this.mInstance = cc.Canvas.instance.addComponent(UIMgr);
                }
                return this.mInstance;
            },
            enumerable: true,
            configurable: true
        });
        /**
             * 获取所有窗口
             */
        UIMgr.prototype.GetAllWinds = function () {
            var array = new Array();
            for (var index = 0; index < fgui.GRoot.inst.numChildren; index++) {
                var element = fgui.GRoot.inst.getChildAt(index);
                if (element instanceof fgui.Window) {
                    array.push(element);
                }
            }
            return array;
        };
        /**
         * 寻找窗口
         * @param type 类型
         */
        UIMgr.prototype.FindWind = function (type) {
            var array = this.GetAllWinds();
            return array.find(function (value, index, obj) {
                return value instanceof type;
            });
        };
        /**
         * 显示界面
         * @param type 界面类型
         * @param param 界面数据
         */
        UIMgr.prototype.ShowWind = function (type, param) {
            if (param === void 0) { param = null; }
            var wind = this.FindWind(type);
            if (wind == null) {
                wind = new type();
            }
            wind.data = param;
            // wind.InitUI(param);
            fgui.GRoot.inst.showWindow(wind);
            // let wind: BaseUI = this.mWinds.get(type)
            // if (wind == null) {
            //     let node: cc.Node = new cc.Node()
            //     this.node.position = cc.Vec2.ZERO
            //     node.setContentSize(this.node.getContentSize())
            //     wind = node.addComponent(type)
            //     let name = wind.prefabUrl.substring(wind.prefabUrl.lastIndexOf("/") + 1)
            //     node.name = name
            //     node.addComponent(cc.Button)
            //     wind.Init(param)
            //     this.mWinds.set(type, wind)
            // }
            // if (!wind.IsShowing)
            //     this.node.addChild(wind.node)
            // else {
            //     if (!wind.IsTop)
            //         this.BringToFront(wind)
            // }
            // wind.Shown(param)
            // this.AdjustModalLayer()
        };
        UIMgr.prototype.HideWind = function (type) {
            var wind = this.FindWind(type);
            if (wind != null) {
                fgui.GRoot.inst.hideWindow(wind);
            }
            // let wind: BaseUI = this.mWinds.get(type)
            // if (wind != null) {
            //     wind.Hide()
            // }
        };
        UIMgr.prototype.HideWindowImmediatelyByType = function (type, dispose) {
            var wind = this.mWinds.get(type);
            if (wind != null) {
                this.HideWindowImmediately(wind, dispose);
            }
        };
        UIMgr.prototype.HideWindowImmediately = function (wind, dispose) {
            if (wind != null) {
                if (wind.node.parent == this.node) {
                    this.node.removeChild(wind.node);
                }
                if (dispose && !wind.dontDel) {
                    wind.node.destroy();
                    var _key_1 = null;
                    this.mWinds.forEach((function (value, key, map) {
                        if (value == wind) {
                            _key_1 = key;
                        }
                    }));
                    if (_key_1 != null)
                        this.mWinds.delete(_key_1);
                }
            }
            this.AdjustModalLayer();
        };
        UIMgr.prototype.GetAllWind = function (isShow, containDotDel) {
            if (isShow === void 0) { isShow = false; }
            if (containDotDel === void 0) { containDotDel = true; }
            var keys = new Array();
            var array = this.GetAllWinds();
            array.forEach((function (value, key, map) {
                if (!isShow || value.isShowing) {
                    if (value instanceof BaseUI) {
                        var wind = value;
                        if (!value.dontDel || containDotDel) {
                            keys.push(value);
                        }
                    }
                    else {
                        keys.push(value);
                    }
                }
            }));
            return keys;
            // let keys: Array<any> = new Array<any>()
            // this.mWinds.forEach(((value: BaseUI, key: any, map: Map<BaseUI, any>) => {
            //     if (!value.dontDel || containDotDel) {
            //         if (isShow) {
            //             if (value.IsShowing) {
            //                 keys.push(key)
            //             }
            //         }
            //         else {
            //             keys.push(key)
            //         }
            //     }
            // }));
            // return keys
        };
        UIMgr.prototype.HideAllWind = function (dispose, containDotDel) {
            if (dispose === void 0) { dispose = false; }
            if (containDotDel === void 0) { containDotDel = false; }
            var winds = this.GetAllWind(false, containDotDel);
            winds.forEach(function (element) {
                if (dispose)
                    element.dispose();
                else
                    fgui.GRoot.inst.hideWindowImmediately(element);
            });
            fgui.GRoot.inst.hidePopup();
            // // let winds = this.GetAllWind(false, containDotDel)
            // // winds.forEach(element => {
            // //     this.HideWindowImmediatelyByType(element, dispose)
            // // });
            // let winds = this.GetAllWind(false, containDotDel)
            // winds.forEach(element =>
            // {
            //     if (dispose)
            //         element.dispose()
            //     else
            //         fgui.GRoot.inst.hideWindowImmediately(element)
            // });
            // fgui.GRoot.inst.hidePopup()
        };
        /**
         * 显示窗口到最前面
         * @param wind 需要显示的窗口
         */
        UIMgr.prototype.BringToFront = function (wind) {
            // let cnt = this.node.childrenCount;
            // let i = cnt - 1;
            // // if (this.mModeLayer.parent != null && !wind.modal)
            // // {
            // //     i = this.mModeLayer.getSiblingIndex() + 1
            // // }
            // for (; i >= 0; i--) {
            //     let g = this.node.children[i].getComponent(BaseUI)
            //     if (g != null) {
            //         if (g == wind) { return; }
            //         else break
            //     }
            // }
            // if (wind != null) {
            //     if (!wind.IsTop) {
            //         if (i >= 0)
            //             wind.node.setSiblingIndex(i)
            //     }
            // }
        };
        UIMgr.prototype.ShowModalWait = function (param) {
            if (param === void 0) { param = null; }
            // if (UIConfig.globalModalWaiting != null) {
            //     this.ShowWind(UIConfig.globalModalWaiting, param)
            // }
            fgui.GRoot.inst.showModalWait(param);
            console.log("msg =" + param);
        };
        UIMgr.prototype.CloseModalWait = function () {
            fgui.GRoot.inst.closeModalWait();
            // if (UIConfig.globalModalWaiting != null) {
            //     this.HideWind(UIConfig.globalModalWaiting)
            // }
        };
        /**
         * 创建一个黑背景
         */
        UIMgr.prototype.createModalLayer = function () {
            this.mModeLayer = new cc.Node("ModalLayer");
            var sp = this.mModeLayer.addComponent(cc.Sprite);
            var xx = new cc.SpriteFrame("res/raw-internal/image/default_sprite_splash.png");
            sp.spriteFrame = xx;
            sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            this.node.addChild(this.mModeLayer);
            var ww = this.mModeLayer.addComponent(cc.Widget);
            ww.isAlignBottom = true;
            ww.isAlignTop = true;
            ww.isAlignLeft = true;
            ww.isAlignRight = true;
            ww.bottom = 0;
            ww.top = 0;
            ww.left = 0;
            ww.right = 0;
            this.mModeLayer.color = cc.color(UIConfig.modalLayerColor.getR(), UIConfig.modalLayerColor.getG(), UIConfig.modalLayerColor.getB());
            this.mModeLayer.opacity = UIConfig.modalLayerColor.getA();
        };
        UIMgr.prototype.AdjustModalLayer = function () {
            // if (this.mModeLayer == null) this.createModalLayer()
            // let cnt = this.node.childrenCount - 1;
            // for (var index = cnt; index >= 0; index--) {
            //     var element = this.node.children[index].getComponent(BaseUI)
            //     if (element != null && element.modal) {
            //         this.mModeLayer.active = false
            //         if (this.mModeLayer.parent == null) {
            //             this.node.insertChild(this.mModeLayer, index)
            //         }
            //         else {
            //             if (index > 0) {
            //                 if (element.IsTop)
            //                     this.mModeLayer.setSiblingIndex(index - 1)
            //                 else
            //                     this.mModeLayer.setSiblingIndex(index)
            //             }
            //             else
            //                 this.mModeLayer.setSiblingIndex(0)
            //         }
            //         this.mModeLayer.active = true
            //         return
            //     }
            // }
            // this.node.removeChild(this.mModeLayer)
        };
        UIMgr.UIStartScale = 0.6;
        UIMgr.mInstance = null;
        return UIMgr;
    }(YK.DispatchEventNode));
    YK.UIMgr = UIMgr;
    // export class BaseUI extends fgui.GComponent
    // {
    // }
    var BaseUI = /** @class */ (function (_super) {
        __extends(BaseUI, _super);
        function BaseUI() {
            var _this = _super.call(this) || this;
            _this.eventMgr = null;
            _this.uiName = "";
            _this.btnCloseNodeName = "BtnClose";
            _this.packName = "";
            _this.resName = "Main";
            _this.modal = false;
            _this.dontDel = false;
            _this.mParam = null;
            _this.UIObj = new Map();
            _this.UICtrls = new Map();
            _this.btnNameStartsWith = "Btn";
            _this.isNeedShowAnimation = false;
            _this.isNeedHideAnimation = false;
            _this.prefabUrl = "";
            _this.clickBbackgroundClose = false;
            return _this;
        }
        Object.defineProperty(BaseUI.prototype, "IsTop", {
            /**
             * 是否在顶层
             */
            get: function () {
                return this.node.parent != null && this.node.getSiblingIndex() == this.node.parent.childrenCount - 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseUI.prototype, "IsShowing", {
            get: function () {
                return this.node.parent != null;
            },
            enumerable: true,
            configurable: true
        });
        BaseUI.prototype.onInit = function () {
            var _this = this;
            _super.prototype.onInit.call(this);
            this.eventMgr = new YK.InterchangeableEventListenerMgr(this, this.OnHandler);
            // this.mParam = param 
            //fairygui
            if (this.contentPane == null) {
                var windObj = fgui.UIPackage.createObject(this.packName, this.resName);
                windObj.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
                this.contentPane = windObj.asCom;
            }
            this.center();
            this.UIObj.clear();
            this.UICtrls.clear();
            for (var index = 0; index < this.contentPane.numChildren; index++) {
                var element = this.contentPane.getChildAt(index);
                if (element.name.startsWith(this.btnNameStartsWith)) {
                    if (element.name == "BtnClose") {
                        // element.on("click", this.OnBtnClose, this)
                        element.onClick(this.OnBtnClose, this);
                    }
                    else {
                        // element.on("click", this.OnBtnClick, this)
                        element.onClick(this.OnBtnClick, this);
                    }
                }
                this.UIObj.set(element.name, element);
            }
            this.contentPane.controllers.forEach(function (element) {
                _this.UICtrls.set(element.name, element);
            });
            this.setPivot(0.5, 0.5);
            this.OninitWind();
            // let prefab = ResMgr.Instance.GetRes(this.prefabUrl)
            // if (prefab != null) {
            //     this.contentPane = cc.instantiate(prefab)
            //     this.contentPane.active = false
            //     this.contentPane.parent = this.node
            //     this.contentPane.active = true
            //     this.contentPane.x = 0
            //     this.contentPane.y = 0
            //     this.contentPane.setContentSize(this.node.getContentSize())
            // }
            // else {
            //     console.error("实例化对象失败：url=" + this.prefabUrl)
            //     return
            // }
            // this.UIObj.clear()
            // let nodes = this.FindAllChildren(this.contentPane)
            // nodes.forEach(element => {
            //     if (element.name.startsWith(this.btnNameStartsWith)) {
            //         //let btn = element.getComponent(cc.Button)
            //         if (element.name == "BtnClose") {
            //             element.on("click", this.OnBtnClose, this)
            //         }
            //         else {
            //             element.on("click", this.OnBtnClick, this)
            //         }
            //     }
            //     this.UIObj.set(element.name, element)
            // });
            // if (this.clickBbackgroundClose && this.modal) {
            //     this.node.on("click", this.OnBtnClose, this)
            // }
            // this.OnInit(param)
        };
        BaseUI.prototype.FindAllChildren = function (root) {
            var _this = this;
            var list = new Array();
            list.push(root);
            if (root.childrenCount <= 0) {
                return list;
            }
            root.children.forEach(function (element) {
                var xx = _this.FindAllChildren(element);
                xx.forEach(function (e) {
                    list.push(e);
                });
            });
            return list;
        };
        BaseUI.prototype.Shown = function (param) {
            this.mParam = param;
            if (this.isNeedShowAnimation)
                this.DoShowAnimation();
            else
                this.OnShown(param);
        };
        BaseUI.prototype.Hide = function () {
            if (this.isNeedHideAnimation)
                this.DoHideAnimation();
            else
                this.OnHide();
        };
        BaseUI.prototype.OnShown = function (Param) {
            this.OnShowWind();
        };
        BaseUI.prototype.OnHide = function () {
            this.mParam = null;
            this.data = null;
            // UIMgr.Instance.HideWindowImmediately(this, false)
            this.eventMgr.RemoveAll();
            this.OnHideWind();
        };
        BaseUI.prototype.OnHandler = function (ev) {
        };
        BaseUI.prototype.DoShowAnimation = function () {
            var _this = this;
            if (this.isNeedHideAnimation) {
                this.scaleX = 0;
                this.scaleY = 0;
                fgui.GTween.to(this.scaleX, 1, 0.3)
                    .setEase(fgui.EaseType.BounceOut)
                    .onUpdate(function (v) {
                    _this.setScale(v.value.x, v.value.x);
                }, this)
                    .onComplete(function () {
                    _super.prototype.doShowAnimation.call(_this);
                }, this);
            }
            else {
                _super.prototype.doShowAnimation.call(this);
            }
            // this.OnShown(this.mParam)
        };
        BaseUI.prototype.DoHideAnimation = function () {
            var _this = this;
            // this.OnHide()
            if (this.isNeedHideAnimation) {
                this.setScale(UIMgr.UIStartScale, UIMgr.UIStartScale);
                fgui.GTween.to(this.scaleX, 0, 0.3)
                    .onUpdate(function (v) {
                    _this.setScale(v.value.x, v.value.x);
                }, this)
                    .onComplete(function () {
                    _super.prototype.doHideAnimation.call(_this);
                }, this);
            }
            else {
                _super.prototype.doHideAnimation.call(this);
            }
        };
        BaseUI.prototype.OnBtnClick = function (ev) {
        };
        BaseUI.prototype.OnBtnClose = function () {
            this.Hide();
        };
        return BaseUI;
    }(fgui.Window));
    YK.BaseUI = BaseUI;
})(YK || (YK = {}));
var YK;
(function (YK) {
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
    YK.GameFlag = GameFlag;
})(YK || (YK = {}));
var YK;
(function (YK) {
    var Log = /** @class */ (function () {
        function Log() {
        }
        Log.Log = console.log;
        Log.Error = console.error;
        Log.Warn = console.warn();
        return Log;
    }());
    YK.Log = Log;
})(YK || (YK = {}));
var YK;
(function (YK) {
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    // @ccclass
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
        Object.defineProperty(TimeDelay, "Instance", {
            get: function () {
                if (this.mInstance == null) {
                    var no = new cc.Node("TimeDelayMgr");
                    cc.game.addPersistRootNode(no);
                    this.mInstance = no.addComponent(TimeDelay);
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
        TimeDelay.mInstance = null;
        return TimeDelay;
    }(cc.Component));
    YK.TimeDelay = TimeDelay;
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
    YK.TimeDelayData = TimeDelayData;
})(YK || (YK = {}));
