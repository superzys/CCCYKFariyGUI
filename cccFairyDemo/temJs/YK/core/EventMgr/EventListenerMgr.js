"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NetMgr_1 = require("../Net/NetMgr");
var SceneMgr_1 = require("../SceneMgr/SceneMgr");
var UIMgr_1 = require("../UIMgr/UIMgr");
var ModeMgr_1 = require("../ModeMgr/ModeMgr");
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
exports.EventListenerMgr = EventListenerMgr;
var InterchangeableEventListenerMgr = /** @class */ (function () {
    function InterchangeableEventListenerMgr(thisObj, defCallback) {
        if (defCallback === void 0) { defCallback = null; }
        this.otherEvents = new Array();
        this.networkEvnets = new EventListenerMgr(NetMgr_1.NetMgr.Instance);
        this.sceneEvents = new EventListenerMgr(SceneMgr_1.SceneMgr.Instance);
        this.uiEvents = new EventListenerMgr(UIMgr_1.UIMgr.Instance);
        this.modeEvents = new EventListenerMgr(ModeMgr_1.ModeMgr.Instance);
        this.mDefObj = thisObj;
        this.otherEvents = new Array();
        this.mDefCallback = new EventListenerData(NetMgr_1.NetMgr.Instance, defCallback, thisObj, null);
        this.mNetCallback = new EventListenerData(NetMgr_1.NetMgr.Instance, defCallback, thisObj, null);
        this.mModeCallback = new EventListenerData(NetMgr_1.NetMgr.Instance, defCallback, thisObj, null);
        this.mSceneCallback = new EventListenerData(NetMgr_1.NetMgr.Instance, defCallback, thisObj, null);
        this.mUICallback = new EventListenerData(NetMgr_1.NetMgr.Instance, defCallback, thisObj, null);
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
        if (dis == NetMgr_1.NetMgr.Instance)
            this.addNetEvent(type, callback, thisObj);
        else if (dis == SceneMgr_1.SceneMgr.Instance)
            this.addSceneEvent(type, callback, thisObj);
        else if (dis == UIMgr_1.UIMgr.Instance)
            this.addUIEvent(type, callback, thisObj);
        else if (dis == ModeMgr_1.ModeMgr.Instance)
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
        if (dis == NetMgr_1.NetMgr.Instance)
            this.removeNetEvent(type, callback, thisObj);
        else if (dis == SceneMgr_1.SceneMgr.Instance)
            this.removeSceneEvent(type, callback, thisObj);
        else if (dis == UIMgr_1.UIMgr.Instance)
            this.removeUIEvent(type, callback, thisObj);
        else if (dis == ModeMgr_1.ModeMgr.Instance)
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
exports.InterchangeableEventListenerMgr = InterchangeableEventListenerMgr;
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
exports.EventListenerData = EventListenerData;
