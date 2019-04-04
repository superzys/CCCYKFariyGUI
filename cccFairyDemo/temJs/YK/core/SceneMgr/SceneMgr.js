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
var DispatchEventNode_1 = require("../EventMgr/DispatchEventNode");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var SceneMgr = /** @class */ (function (_super) {
    __extends(SceneMgr, _super);
    function SceneMgr() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mScenes = new Map();
        _this.mCurScene = null;
        return _this;
    }
    SceneMgr_1 = SceneMgr;
    Object.defineProperty(SceneMgr, "Instance", {
        get: function () {
            if (this.mInstance == null) {
                var no = new cc.Node("SceneMgr");
                cc.game.addPersistRootNode(no);
                this.mInstance = no.addComponent(SceneMgr_1);
            }
            return this.mInstance;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 跳转场景
     * @param type 场景脚本文件
     * @param param 参数
     */
    SceneMgr.prototype.GoToScene = function (script, param) {
        if (param === void 0) { param = null; }
        if (!this.mScenes.has(script)) {
            if (this.mCurScene != null) {
                this.mCurScene.Leave();
            }
            var scene = new script();
            this.mScenes.set(script, scene);
            this.mCurScene = scene;
            this.mCurScene.Enter(param);
        }
        else {
            var scene = this.mScenes.get(script);
            if (scene == this.mCurScene) {
                console.error("当前场景与目标场景一样无法重新进入这个场景");
                return;
            }
            else {
                if (this.mCurScene != null) {
                    this.mCurScene.Leave();
                    this.mCurScene = this.mScenes.get(script);
                    this.mCurScene.Enter(param);
                }
            }
        }
    };
    var SceneMgr_1;
    //private mBolckBg : cc.Node = null
    SceneMgr.mInstance = null;
    SceneMgr = SceneMgr_1 = __decorate([
        ccclass
    ], SceneMgr);
    return SceneMgr;
}(DispatchEventNode_1.DispatchEventNode));
exports.SceneMgr = SceneMgr;
