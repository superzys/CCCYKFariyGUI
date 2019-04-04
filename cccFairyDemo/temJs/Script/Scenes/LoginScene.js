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
var SceneBase_1 = require("../../YK/core/SceneMgr/SceneBase");
var LoginWind_1 = require("../Winds/LoginWind");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LoginScene = /** @class */ (function (_super) {
    __extends(LoginScene, _super);
    function LoginScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.firstWind = LoginWind_1.LoginWind;
        return _this;
    }
    LoginScene.prototype.OnInit = function (param) {
        _super.prototype.OnInit.call(this, param);
        this.needLoadRes
            .add("ui/LoginPack.bin", true, true)
            .add("ui/BasePack.bin", true, true)
            .add("ui/BasePack_atlas0.png", true);
    };
    LoginScene.prototype.OnEnter = function (param) {
        _super.prototype.OnEnter.call(this, param);
    };
    LoginScene.prototype.OnHandler = function (ev) {
        _super.prototype.OnHandler.call(this, ev);
    };
    LoginScene.prototype.OnLeave = function () {
        _super.prototype.OnLeave.call(this);
    };
    LoginScene.prototype.OnDestroy = function () {
        _super.prototype.OnDestroy.call(this);
    };
    LoginScene.prototype.OnLoaded = function () {
        _super.prototype.OnLoaded.call(this);
    };
    LoginScene.prototype.OnTaskFinished = function () {
        _super.prototype.OnTaskFinished.call(this);
    };
    LoginScene = __decorate([
        ccclass
    ], LoginScene);
    return LoginScene;
}(SceneBase_1.SceneBase));
exports.LoginScene = LoginScene;
