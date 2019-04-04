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
var ResponseMessageEvent_1 = require("./ResponseMessageEvent");
var PackBase_1 = require("./PackBase");
var ProtoMap_1 = require("./ProtoMap");
var TimeDelay_1 = require("../Util/TimeDelay");
var DispatchEventNode_1 = require("../EventMgr/DispatchEventNode");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NetMgr = /** @class */ (function (_super) {
    __extends(NetMgr, _super);
    function NetMgr() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.httpUrl = "http://39.107.84.87:9100/?";
        _this.mTimeout = 10; //默认十秒
        _this.mHeartTimeout = 10;
        _this.pbkill = require("./pbkiller/src/pbkiller");
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
        TimeDelay_1.TimeDelay.Instance.Add(1, 0, this.CheckSendTimeOut, this);
    };
    NetMgr.prototype.onDestroy = function () {
        TimeDelay_1.TimeDelay.Instance.Remove(this.CheckSendTimeOut, this);
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
            ProtoMap_1.ProtoMap.Add(protoName, _class);
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
        TimeDelay_1.TimeDelay.Instance.Remove(this.sendHeartbeat, this);
        TimeDelay_1.TimeDelay.Instance.Remove(this.checkHeartbeat, this);
        TimeDelay_1.TimeDelay.Instance.Add(3, 0, this.sendHeartbeat, this);
        TimeDelay_1.TimeDelay.Instance.Add(3, 0, this.checkHeartbeat, this);
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
        TimeDelay_1.TimeDelay.Instance.Remove(this.sendHeartbeat, this);
        TimeDelay_1.TimeDelay.Instance.Remove(this.checkHeartbeat, this);
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
            head = ProtoMap_1.ProtoMap.UnPackHead(data);
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
            var ev = new ResponseMessageEvent_1.ResponseMessageEvent(head.cmd.toString());
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
        var head = new PackBase_1.PackBase();
        head.cmd = id;
        head.errorcode = 0;
        head.msgid = this.Msgid;
        var sendData = {
            head: head,
            sendTime: Date.now()
        };
        if (this.isConnect()) {
            var buffer = ProtoMap_1.ProtoMap.Pack(head, data);
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
        var msg = ProtoMap_1.ProtoMap.UnPack(head);
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
            var ev = new ResponseMessageEvent_1.ResponseMessageEvent(head.cmd.toString());
            ev.SetData(head, msg);
            this.DispatchEvent(ev);
        }
    };
    __decorate([
        property
    ], NetMgr.prototype, "ip", void 0);
    return NetMgr;
}(DispatchEventNode_1.DispatchEventNode));
exports.NetMgr = NetMgr;
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
exports.NetMgrEventDef = NetMgrEventDef;
