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
        this.finish = new DispatchEventNode_1.Func(thisObjs, callback);
        return this;
    };
    LoadGruopInfo.prototype.onItemCompletion = function (callback, thisObjs) {
        this.loadItem = new DispatchEventNode_1.Func(thisObjs, callback);
        return this;
    };
    LoadGruopInfo.prototype.start = function () {
        ResMgr.Instance.LoadGroup(this);
    };
    return LoadGruopInfo;
}());
exports.LoadGruopInfo = LoadGruopInfo;
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
}(DispatchEventNode_1.DispatchEventNode));
exports.ResMgr = ResMgr;
