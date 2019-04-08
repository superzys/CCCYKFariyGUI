"use strict";
// import { IMode } from "../../YK/core/ModeMgr/ModeMgr";
// import { ResponseMessageEvent } from "../../YK/core/Net/ResponseMessageEvent";
// import { Func } from "../../YK/core/EventMgr/DispatchEventNode";
// import { NetMgr, HttpRespData } from "../../YK/core/Net/NetMgr";
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
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
// @ccclass
var RoleMode = /** @class */ (function (_super) {
    __extends(RoleMode, _super);
    function RoleMode() {
        var _this = _super.call(this) || this;
        _this.accountInfo = { userid: 0, token: "" };
        YK.Log.Log("stasrt after  new");
        return _this;
    }
    RoleMode.prototype.OnInitData = function (param) {
        this.eventMgr.setNetCallback(this.OnNetEvenet, 99);
        this.eventMgr.addNetEvent(200);
    };
    RoleMode.prototype.OnClear = function () {
    };
    RoleMode.prototype.OnDestroy = function () {
        _super.prototype.OnDestroy.call(this);
    };
    RoleMode.prototype.OnNetEvenet = function (ev) {
    };
    RoleMode.prototype.SendHttpLogin = function (account, pwd, callBack) {
        var _this = this;
        YK.NetMgr.Instance.SendGet("modeName=account&api=login&account=" + account + "&pwd=" + pwd, new YK.Func(this, function (res) {
            if (res != null && res.errorcode == 0) {
                _this.accountInfo.token = res.data.token;
                _this.accountInfo.userid = res.data.userid;
            }
            if (callBack != null) {
                callBack.Invoke(res);
            }
        }));
    };
    /**
     * 发送登陆
     * @param userid 用户id
     * @param token 账号token
     */
    RoleMode.prototype.SendLogin = function () {
    };
    return RoleMode;
}(YK.IMode));
exports.RoleMode = RoleMode;
