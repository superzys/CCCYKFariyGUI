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
var DispatchEventNode_1 = require("../../YK/core/EventMgr/DispatchEventNode");
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var EventDef = /** @class */ (function (_super) {
    __extends(EventDef, _super);
    function EventDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EventDef = __decorate([
        ccclass
    ], EventDef);
    return EventDef;
}(cc.Component));
exports.EventDef = EventDef;
var LoadingProgressEvenet = /** @class */ (function (_super) {
    __extends(LoadingProgressEvenet, _super);
    function LoadingProgressEvenet() {
        return _super.call(this, LoadingProgressEvenet.EventID, { Progress: 0, showInfoString: "正在加载..." }) || this;
    }
    Object.defineProperty(LoadingProgressEvenet.prototype, "Progress", {
        set: function (progress) {
            this.data.progress = progress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoadingProgressEvenet.prototype, "ShowInfoString", {
        set: function (ShowInfoString) {
            this.data.showInfoString = ShowInfoString;
        },
        enumerable: true,
        configurable: true
    });
    LoadingProgressEvenet.EventID = "LoadingProgressEvenet";
    return LoadingProgressEvenet;
}(DispatchEventNode_1.EventData));
exports.LoadingProgressEvenet = LoadingProgressEvenet;
