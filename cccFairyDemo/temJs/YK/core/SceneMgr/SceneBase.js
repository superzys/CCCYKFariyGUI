"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var EventListenerMgr_1 = require("../EventMgr/EventListenerMgr");
var ResMgr_1 = require("../ResMgr/ResMgr");
var TaskBase_1 = require("../Task/TaskBase");
var DispatchEventNode_1 = require("../EventMgr/DispatchEventNode");
var UIMgr_1 = require("../UIMgr/UIMgr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var SceneBase = /** @class */ (function () {
    function SceneBase() {
        this.firstWind = null;
        this.mLoaded = false;
        this.mTaskFinished = false;
        this.needLoadRes = new ResMgr_1.LoadGruopInfo();
        this.needLoadRes.onCompletion(this.Loaded, this);
        this.tasks = new TaskBase_1.TaskMgr(true, new DispatchEventNode_1.Func(this, this.TaskFinished));
        this.eventMgr = new EventListenerMgr_1.InterchangeableEventListenerMgr(this, this.OnHandler);
    }
    SceneBase.prototype.Enter = function (param) {
        ResMgr_1.ResMgr.Instance.push();
        //UIMgr.Instance.HideAllWind()
        this.mLoaded = false;
        this.mTaskFinished = false;
        this.tasks.Stop();
        this.mParam = param;
        this.OnInit(param);
        this.needLoadRes.start();
        this.tasks.Execute();
    };
    SceneBase.prototype.Leave = function () {
        if (this.eventMgr != null)
            this.eventMgr.RemoveAll();
        if (this.tasks != null)
            this.tasks.Stop();
        this.OnLeave();
    };
    SceneBase.prototype.Destroy = function () {
        this.OnDestroy();
    };
    /**
     * 任务完成
     * @param error 错误
     */
    SceneBase.prototype.TaskFinished = function (error) {
        if (error != null) {
            console.error(error);
        }
        else {
            this.OnTaskFinished();
            this.mTaskFinished = true;
            this.ChechEnter();
        }
    };
    /**
     * 加载完成
     * @param error 加载错误
     */
    SceneBase.prototype.Loaded = function (error) {
        if (error != null) {
            console.error(error);
        }
        else {
            this.OnLoaded();
            this.mLoaded = true;
            this.ChechEnter();
        }
    };
    SceneBase.prototype.ChechEnter = function () {
        if (this.mLoaded && this.mTaskFinished) {
            UIMgr_1.UIMgr.Instance.HideAllWind(true);
            ResMgr_1.ResMgr.Instance.pop();
            if (this.firstWind != null) {
                UIMgr_1.UIMgr.Instance.ShowWind(this.firstWind);
            }
            this.OnEnter(this.mParam);
        }
    };
    /**
     * 加载完成
     */
    SceneBase.prototype.OnLoaded = function () {
    };
    /**
     * 任务完成
     */
    SceneBase.prototype.OnTaskFinished = function () {
    };
    /**
    * 处理消息
    * @param ev 参数
    */
    SceneBase.prototype.OnHandler = function (ev) {
    };
    /**
    * 场景初始化
    * @param param 参数
    */
    SceneBase.prototype.OnInit = function (param) {
    };
    /**
     * 进入场景
     */
    SceneBase.prototype.OnEnter = function (param) {
    };
    /**
     * 离开场景
     */
    SceneBase.prototype.OnLeave = function () {
    };
    /**
     * 当场景被销毁的时候
     */
    SceneBase.prototype.OnDestroy = function () {
    };
    SceneBase = __decorate([
        ccclass
    ], SceneBase);
    return SceneBase;
}());
exports.SceneBase = SceneBase;
