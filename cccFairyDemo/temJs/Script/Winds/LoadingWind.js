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
var EventDef_1 = require("../Defs/EventDef");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LoadingWind = /** @class */ (function (_super) {
    __extends(LoadingWind, _super);
    function LoadingWind() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.packName = "Loading";
        _this.resName = "loadingWind";
        _this.modal = false;
        _this.dontDel = true;
        _this.btnNameStartsWith = "Btn";
        _this.isNeedShowAnimation = false;
        _this.isNeedHideAnimation = false;
        _this.mProgress = 0;
        _this.mShowInfoString = "正在加载...";
        return _this;
    }
    LoadingWind.prototype.OninitWind = function () {
        this.mlabelProgress = this.UIObj.get("labelProgress").asTextField;
        this.mlablMsg = this.UIObj.get("lablMsg").asTextField;
        this.mlabelProgress.text = "0%";
    };
    LoadingWind.prototype.OnShowWind = function () {
        this.eventMgr.addUIEvent(EventDef_1.LoadingProgressEvenet.EventID);
        this.mProgress = 0;
        this.mShowInfoString = "正在加载...";
        this.mlabelProgress.text = this.mProgress.toFixed() + "%";
    };
    LoadingWind.prototype.OnHideWind = function () {
    };
    LoadingWind.prototype.OnHandler = function (ev) {
        switch (ev.cmd) {
            case EventDef_1.LoadingProgressEvenet.EventID:
                this.RefreshInfo(ev);
                break;
        }
    };
    LoadingWind.prototype.RefreshInfo = function (ev) {
        this.mProgress = ev.data.progress;
        this.mlabelProgress.text = this.mProgress.toFixed() + "%";
    };
    LoadingWind = __decorate([
        ccclass
    ], LoadingWind);
    return LoadingWind;
}(UIMgr_1.BaseUI));
exports.LoadingWind = LoadingWind;
