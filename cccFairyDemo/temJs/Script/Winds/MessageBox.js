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
var UIMgr_1 = require("../../YK/core/UIMgr/UIMgr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var MessageBox = /** @class */ (function (_super) {
    __extends(MessageBox, _super);
    function MessageBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.modal = true;
        _this.dontDel = true;
        _this.packName = "BasePack";
        _this.resName = "MessageBox";
        _this.clickBbackgroundClose = false;
        _this.mData = null;
        return _this;
    }
    MessageBox_1 = MessageBox;
    MessageBox.Create = function (content) {
        if (this.mMessageBoxDataPools.length > 0) {
            var da = this.mMessageBoxDataPools.pop();
            da.SetContent(content);
            return da;
        }
        return new MessageBoxData(content);
    };
    MessageBox.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        MessageBox_1.mMessageBoxDataPools.splice(0, MessageBox_1.mMessageBoxDataPools.length);
    };
    MessageBox.prototype.OnBtnClick = function (ev) {
        _super.prototype.OnBtnClick.call(this, ev);
        if (ev.target == this.BtnOK.node) {
            if (this.mData.BtnOkCallBack != null)
                this.mData.BtnOkCallBack.Invoke();
            this.OnBtnClose();
        }
        else if (ev.target == this.BtnCancel.node) {
            if (this.mData.BtnCancelCallBack != null)
                this.mData.BtnCancelCallBack.Invoke();
            this.OnBtnClose();
        }
        else if (ev.target == this.BtnConfirm.node) {
            if (this.mData.BtnBtnConfirmCallBack != null)
                this.mData.BtnBtnConfirmCallBack.Invoke();
            this.OnBtnClose();
        }
    };
    MessageBox.prototype.OninitWind = function () {
        this.BtnOK = this.UIObj.get("BtnOK").asButton;
        this.BtnCancel = this.UIObj.get("BtnCancel").asButton;
        this.BtnConfirm = this.UIObj.get("BtnConfirm").asButton;
        this.labelMsg = this.UIObj.get("labelMsg").asTextField;
    };
    MessageBox.prototype.OnShowWind = function () {
        this.mData = this.data;
        if (this.mData.type == MessageBoxType.None) {
        }
        else if (this.mData.type == MessageBoxType.ShowConfirm) {
            this.BtnConfirm.text = this.mData.labBtnConfirmStr;
        }
        else {
            this.BtnOK.text = this.mData.labBtnOkStr;
            this.BtnCancel.text = this.mData.labBtnCancelStr;
        }
        this.UICtrls.get("stateCtrl").selectedIndex = this.mData.type;
        this.labelMsg.text = this.mData.content;
    };
    MessageBox.prototype.OnHideWind = function () {
        if (this.mData != null) {
            this.mData.reset();
            MessageBox_1.mMessageBoxDataPools.push(this.mData);
            this.mData = null;
        }
    };
    var MessageBox_1;
    MessageBox.mMessageBoxDataPools = new Array();
    MessageBox = MessageBox_1 = __decorate([
        ccclass
    ], MessageBox);
    return MessageBox;
}(UIMgr_1.BaseUI));
exports.MessageBox = MessageBox;
var MessageBoxType;
(function (MessageBoxType) {
    MessageBoxType[MessageBoxType["None"] = 0] = "None";
    MessageBoxType[MessageBoxType["ShowConfirm"] = 1] = "ShowConfirm";
    MessageBoxType[MessageBoxType["ShowOkAndCancel"] = 2] = "ShowOkAndCancel";
})(MessageBoxType || (MessageBoxType = {}));
var MessageBoxData = /** @class */ (function () {
    function MessageBoxData(content) {
        this.content = null;
        this.BtnOkCallBack = null;
        this.labBtnOkStr = null;
        this.BtnCancelCallBack = null;
        this.labBtnCancelStr = null;
        this.BtnBtnConfirmCallBack = null;
        this.labBtnConfirmStr = null;
        this.content = content;
    }
    Object.defineProperty(MessageBoxData.prototype, "type", {
        get: function () {
            var t = MessageBoxType.None;
            if (this.BtnBtnConfirmCallBack != null) {
                t = MessageBoxType.ShowConfirm;
            }
            else if (this.BtnOkCallBack != null || this.BtnCancelCallBack != null) {
                t = MessageBoxType.ShowOkAndCancel;
            }
            return t;
        },
        enumerable: true,
        configurable: true
    });
    MessageBoxData.prototype.SetBtnOkAndCancelCallBack = function (okCallBack, okStr, cancelCallBack, cancelStr) {
        if (okStr === void 0) { okStr = "好的"; }
        if (cancelCallBack === void 0) { cancelCallBack = null; }
        if (cancelStr === void 0) { cancelStr = "好的"; }
        this.BtnOkCallBack = okCallBack;
        this.labBtnOkStr = okStr;
        this.BtnCancelCallBack = cancelCallBack;
        this.labBtnCancelStr = cancelStr;
        return this;
    };
    MessageBoxData.prototype.SetBtnConfirmCallBack = function (callBack, labStr) {
        if (labStr === void 0) { labStr = "确定"; }
        this.BtnBtnConfirmCallBack = callBack;
        this.labBtnConfirmStr = labStr;
        this.BtnOkCallBack = null;
        this.labBtnOkStr = null;
        this.BtnCancelCallBack = null;
        this.labBtnCancelStr = null;
        return this;
    };
    MessageBoxData.prototype.SetContent = function (content) {
        this.content = content;
    };
    MessageBoxData.prototype.reset = function () {
        this.BtnOkCallBack = null;
        this.labBtnOkStr = null;
        this.BtnCancelCallBack = null;
        this.labBtnCancelStr = null;
        this.BtnBtnConfirmCallBack = null;
        this.labBtnConfirmStr = null;
        this.content = null;
    };
    MessageBoxData.prototype.Show = function () {
        UIMgr_1.UIMgr.Instance.ShowWind(MessageBox, this);
    };
    return MessageBoxData;
}());
