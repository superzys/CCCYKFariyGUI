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
var ModeMgr_1 = require("../../YK/core/ModeMgr/ModeMgr");
var DispatchEventNode_1 = require("../../YK/core/EventMgr/DispatchEventNode");
var NetMgr_1 = require("../../YK/core/Net/NetMgr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var RoleMode = /** @class */ (function (_super) {
    __extends(RoleMode, _super);
    function RoleMode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.accountInfo = { userid: 0, token: "" };
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
        if (ev.Data.head.errorcode == 0) {
            if (ev.Data.head.cmd == 200) {
                this.OnLoginResp(ev.Data.msg);
            }
        }
    };
    RoleMode.prototype.SendHttpLogin = function (account, pwd, callBack) {
        var _this = this;
        NetMgr_1.NetMgr.Instance.SendGet("modeName=account&api=login&account=" + account + "&pwd=" + pwd, new DispatchEventNode_1.Func(this, function (res) {
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
        var sendData = { token: this.accountInfo.token, roleid: this.accountInfo.userid };
        NetMgr_1.NetMgr.Instance.Send(200, sendData);
    };
    /**
     * 登陆返回
     * @param loginResp 登陆的返回信息
     */
    RoleMode.prototype.OnLoginResp = function (loginResp) {
        this.roleInfo = loginResp.roleinfo;
    };
    RoleMode = __decorate([
        ccclass
    ], RoleMode);
    return RoleMode;
}(ModeMgr_1.IMode));
exports.RoleMode = RoleMode;
