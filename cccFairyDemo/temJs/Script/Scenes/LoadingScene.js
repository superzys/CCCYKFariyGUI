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
var ResMgr_1 = require("../../YK/core/ResMgr/ResMgr");
var SceneBase_1 = require("../../YK/core/SceneMgr/SceneBase");
var NetMgr_1 = require("../../YK/core/Net/NetMgr");
var UIMgr_1 = require("../../YK/core/UIMgr/UIMgr");
var ProtoMap_1 = require("../../YK/core/Net/ProtoMap");
var SceneMgr_1 = require("../../YK/core/SceneMgr/SceneMgr");
var LoginScene_1 = require("./LoginScene");
var EventDef_1 = require("../Defs/EventDef");
var WaitWind_1 = require("../Winds/WaitWind");
var LoadingWind_1 = require("../Winds/LoadingWind");
var ProtocolDef_1 = require("../Defs/ProtocolDef");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LoadingScene = /** @class */ (function (_super) {
    __extends(LoadingScene, _super);
    function LoadingScene() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoadingScene.prototype.OnInit = function (param) {
        _super.prototype.OnInit.call(this, param);
        this.needLoadRes
            .add("ui/Loading_atlas_vckm32.jpg", true)
            .add("ui/Loading_atlas0.png", true)
            .add("ui/Loading.bin", true, true);
        this.initNeedLoadTask = new ResMgr_1.LoadGruopInfo();
        this.initNeedLoadTask.add("ui/BasePack_atlas0.png", true)
            .add("ui/BasePack.bin", true, true)
            .onItemCompletion(this.loadItemCompletion, this)
            .onCompletion(this.loadGameResFinish, this);
    };
    LoadingScene.prototype.loadItemCompletion = function () {
        console.log(this.initNeedLoadTask.Progress);
        var ev = new EventDef_1.LoadingProgressEvenet();
        ev.Progress = this.initNeedLoadTask.Progress;
        UIMgr_1.UIMgr.Instance.DispatchEvent(ev);
    };
    /**
     * 资源加载完成
     */
    LoadingScene.prototype.loadGameResFinish = function () {
        NetMgr_1.NetMgr.Instance.AddProto("NetPack.proto", ProtocolDef_1.ProtocolDef.ProtocolNames);
        fgui.UIObjectFactory.setPackageItemExtension(fgui.UIConfig.globalModalWaiting, WaitWind_1.WaitWind);
        this.AddProto();
        ProtocolDef_1.ProtocolDef.Protocols.forEach(function (element) {
            ProtoMap_1.ProtoMap.AddProto(element);
        });
    };
    LoadingScene.prototype.AddProto = function () {
        NetMgr_1.NetMgr.Instance.AddProto("netpack", ProtocolDef_1.ProtocolDef.ProtocolNames);
        this.StartGame();
    };
    LoadingScene.prototype.StartGame = function () {
        var ev = new EventDef_1.LoadingProgressEvenet();
        ev.Progress = 100;
        UIMgr_1.UIMgr.Instance.DispatchEvent(ev);
        SceneMgr_1.SceneMgr.Instance.GoToScene(LoginScene_1.LoginScene);
    };
    LoadingScene.prototype.OnEnter = function (param) {
        _super.prototype.OnEnter.call(this, param);
        UIMgr_1.UIMgr.Instance.ShowWind(LoadingWind_1.LoadingWind);
        this.initNeedLoadTask.start();
    };
    LoadingScene.prototype.OnHandler = function (ev) {
        _super.prototype.OnHandler.call(this, ev);
    };
    LoadingScene.prototype.OnLeave = function () {
        _super.prototype.OnLeave.call(this);
    };
    LoadingScene.prototype.OnDestroy = function () {
        _super.prototype.OnDestroy.call(this);
    };
    LoadingScene.prototype.OnLoaded = function () {
        _super.prototype.OnLoaded.call(this);
    };
    LoadingScene.prototype.OnTaskFinished = function () {
        _super.prototype.OnTaskFinished.call(this);
    };
    LoadingScene = __decorate([
        ccclass
    ], LoadingScene);
    return LoadingScene;
}(SceneBase_1.SceneBase));
exports.LoadingScene = LoadingScene;
