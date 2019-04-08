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
// import { BaseUI, UIMgr } from "../../YK/core/UIMgr/UIMgr";
var MessageBox_1 = require("./MessageBox");
var LoadingWind_1 = require("./LoadingWind");
// import { NetMgrEventDef, HttpRespData, NetMgr } from "../../YK/core/Net/NetMgr";
// import { ModeMgr } from "../../YK/core/ModeMgr/ModeMgr";
var RoleMode_1 = require("../Modes/RoleMode");
// import { Func, EventData } from "../../YK/core/EventMgr/DispatchEventNode";
// import { ResponseDataInfo, ResponseMessageEvent } from "../../YK/core/Net/ResponseMessageEvent";
var MainScene_1 = require("../Scenes/MainScene");
// import { SceneMgr } from "../../YK/core/SceneMgr/SceneMgr";
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LoginWind = /** @class */ (function (_super) {
    __extends(LoginWind, _super);
    function LoginWind() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.packName = "LoginPack";
        _this.resName = "LoginWindow";
        _this.modal = false;
        _this.dontDel = true;
        _this.btnNameStartsWith = "Btn";
        _this.isNeedShowAnimation = false;
        _this.isNeedHideAnimation = false;
        return _this;
    }
    LoginWind.prototype.OninitWind = function () {
        this.eventMgr.setNetCallback(this.OnNetMsg);
        this.mLabelAcc = this.UIObj.get("LabelAcc").asTextField;
        this.mLabelPass = this.UIObj.get("LabelPass").asTextField;
    };
    LoginWind.prototype.OnShowWind = function () {
        YK.UIMgr.Instance.HideWind(LoadingWind_1.LoadingWind);
        this.eventMgr.addNetEvent(200);
        this.eventMgr.addNetEvent(YK.NetMgrEventDef.onopen);
        this.eventMgr.addNetEvent(YK.NetMgrEventDef.onerror);
        this.eventMgr.addModeEvent(YK.ModeMgr.EventType.SENDINITMSGOK);
    };
    LoginWind.prototype.OnHideWind = function () {
    };
    LoginWind.prototype.OnBtnClick = function (ev) {
        _super.prototype.OnBtnClick.call(this, ev);
        if (ev.currentTarget.$gobj.name == "BtnLogin") {
            this.HttpLogin();
        }
    };
    LoginWind.prototype.HttpLogin = function () {
        var _this = this;
        this.OnInitMsged();
        return;
        if (this.mLabelAcc.text == "" || this.mLabelPass.text == "") {
            MessageBox_1.MessageBox.Create("请输入账号密码").Show();
        }
        else {
            YK.UIMgr.Instance.ShowModalWait();
            YK.ModeMgr.Instance.GetMode(RoleMode_1.RoleMode).SendHttpLogin(this.mLabelAcc.text, this.mLabelPass.text, new YK.Func(this, function (res) {
                if (res != null) {
                    if (res.errorcode == 0) {
                        _this.ConnectServer();
                    }
                    else {
                        YK.UIMgr.Instance.CloseModalWait();
                        MessageBox_1.MessageBox.Create(res.msg).Show();
                    }
                }
                else {
                    YK.UIMgr.Instance.CloseModalWait();
                    MessageBox_1.MessageBox.Create("登陆失败尝试重新登陆").Show();
                }
            }));
        }
    };
    LoginWind.prototype.ConnectServer = function () {
        YK.NetMgr.Instance.connect();
    };
    LoginWind.prototype.OnConnetServer = function () {
        YK.ModeMgr.Instance.GetMode(RoleMode_1.RoleMode).SendLogin();
    };
    LoginWind.prototype.OnLogin = function (ev) {
        YK.UIMgr.Instance.CloseModalWait();
        if (ev.head.errorcode == 0) {
            YK.UIMgr.Instance.ShowModalWait();
            YK.ModeMgr.Instance.SendInitMsg();
        }
        else {
            MessageBox_1.MessageBox.Create(ev.msg).Show();
        }
    };
    LoginWind.prototype.OnInitMsged = function () {
        console.error("开始游戏");
        YK.UIMgr.Instance.CloseModalWait();
        YK.SceneMgr.Instance.GoToScene(MainScene_1.MainScene);
    };
    LoginWind.prototype.OnConnetServerError = function (error) {
        var _this = this;
        MessageBox_1.MessageBox.Create("链接服务器失败，尝试重连")
            .SetBtnConfirmCallBack(new YK.Func(this, function () {
            _this.ConnectServer();
        }), "重试")
            .Show();
    };
    LoginWind.prototype.OnNetMsg = function (ev) {
        if (ev.cmd == YK.NetMgrEventDef.onopen) {
            this.OnConnetServer();
        }
        else if (ev.cmd == YK.NetMgrEventDef.onerror
            || ev.cmd == YK.NetMgrEventDef.onclose) {
            this.OnConnetServerError(ev.data);
        }
        else {
            if (ev.Data.head.cmd == 200) {
                this.OnLogin(ev.Data);
            }
        }
    };
    LoginWind.prototype.OnHandler = function (ev) {
        if (ev.cmd == YK.ModeMgr.EventType.SENDINITMSGOK) {
            this.OnInitMsged();
        }
    };
    LoginWind = __decorate([
        ccclass
    ], LoginWind);
    return LoginWind;
}(YK.BaseUI));
exports.LoginWind = LoginWind;
