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
var EventListenerMgr_1 = require("../EventMgr/EventListenerMgr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var UIConfig = /** @class */ (function () {
    function UIConfig() {
    }
    UIConfig.modalLayerColor = new cc.Color(0, 0, 0, 0.4 * 255); //默认显示背景颜色
    UIConfig.globalModalWaiting = null; //等待界面
    UIConfig.autoCloseWaitingTime = 10; //自动关闭等待界面的时间
    return UIConfig;
}());
exports.UIConfig = UIConfig;
var UIMgr = /** @class */ (function (_super) {
    __extends(UIMgr, _super);
    function UIMgr() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mWinds = new Map();
        _this.modalWaitPane = null;
        return _this;
    }
    UIMgr_1 = UIMgr;
    Object.defineProperty(UIMgr, "Instance", {
        get: function () {
            if (this.mInstance == null) {
                this.mInstance = cc.Canvas.instance.addComponent(UIMgr_1);
            }
            return this.mInstance;
        },
        enumerable: true,
        configurable: true
    });
    /**
         * 获取所有窗口
         */
    UIMgr.prototype.GetAllWinds = function () {
        var array = new Array();
        for (var index = 0; index < fgui.GRoot.inst.numChildren; index++) {
            var element = fgui.GRoot.inst.getChildAt(index);
            if (element instanceof fgui.Window) {
                array.push(element);
            }
        }
        return array;
    };
    /**
     * 寻找窗口
     * @param type 类型
     */
    UIMgr.prototype.FindWind = function (type) {
        var array = this.GetAllWinds();
        return array.find(function (value, index, obj) {
            return value instanceof type;
        });
    };
    /**
     * 显示界面
     * @param type 界面类型
     * @param param 界面数据
     */
    UIMgr.prototype.ShowWind = function (type, param) {
        if (param === void 0) { param = null; }
        var wind = this.FindWind(type);
        if (wind == null) {
            wind = new type();
        }
        wind.data = param;
        // wind.init(param);
        fgui.GRoot.inst.showWindow(wind);
        // let wind: BaseUI = this.mWinds.get(type)
        // if (wind == null) {
        //     let node: cc.Node = new cc.Node()
        //     this.node.position = cc.Vec2.ZERO
        //     node.setContentSize(this.node.getContentSize())
        //     wind = node.addComponent(type)
        //     let name = wind.prefabUrl.substring(wind.prefabUrl.lastIndexOf("/") + 1)
        //     node.name = name
        //     node.addComponent(cc.Button)
        //     wind.Init(param)
        //     this.mWinds.set(type, wind)
        // }
        // if (!wind.IsShowing)
        //     this.node.addChild(wind.node)
        // else {
        //     if (!wind.IsTop)
        //         this.BringToFront(wind)
        // }
        // wind.Shown(param)
        // this.AdjustModalLayer()
    };
    UIMgr.prototype.HideWind = function (type) {
        var wind = this.FindWind(type);
        if (wind != null) {
            fgui.GRoot.inst.hideWindow(wind);
        }
        // let wind: BaseUI = this.mWinds.get(type)
        // if (wind != null) {
        //     wind.Hide()
        // }
    };
    UIMgr.prototype.HideWindowImmediatelyByType = function (type, dispose) {
        var wind = this.mWinds.get(type);
        if (wind != null) {
            this.HideWindowImmediately(wind, dispose);
        }
    };
    UIMgr.prototype.HideWindowImmediately = function (wind, dispose) {
        if (wind != null) {
            if (wind.node.parent == this.node) {
                this.node.removeChild(wind.node);
            }
            if (dispose && !wind.dontDel) {
                wind.node.destroy();
                var _key_1 = null;
                this.mWinds.forEach((function (value, key, map) {
                    if (value == wind) {
                        _key_1 = key;
                    }
                }));
                if (_key_1 != null)
                    this.mWinds.delete(_key_1);
            }
        }
        this.AdjustModalLayer();
    };
    UIMgr.prototype.GetAllWind = function (isShow, containDotDel) {
        if (isShow === void 0) { isShow = false; }
        if (containDotDel === void 0) { containDotDel = true; }
        var keys = new Array();
        var array = this.GetAllWinds();
        array.forEach((function (value, key, map) {
            if (!isShow || value.isShowing) {
                if (value instanceof BaseUI) {
                    var wind = value;
                    if (!value.dontDel || containDotDel) {
                        keys.push(value);
                    }
                }
                else {
                    keys.push(value);
                }
            }
        }));
        return keys;
        // let keys: Array<any> = new Array<any>()
        // this.mWinds.forEach(((value: BaseUI, key: any, map: Map<BaseUI, any>) => {
        //     if (!value.dontDel || containDotDel) {
        //         if (isShow) {
        //             if (value.IsShowing) {
        //                 keys.push(key)
        //             }
        //         }
        //         else {
        //             keys.push(key)
        //         }
        //     }
        // }));
        // return keys
    };
    UIMgr.prototype.HideAllWind = function (dispose, containDotDel) {
        if (dispose === void 0) { dispose = false; }
        if (containDotDel === void 0) { containDotDel = false; }
        var winds = this.GetAllWind(false, containDotDel);
        winds.forEach(function (element) {
            if (dispose)
                element.dispose();
            else
                fgui.GRoot.inst.hideWindowImmediately(element);
        });
        fgui.GRoot.inst.hidePopup();
        // // let winds = this.GetAllWind(false, containDotDel)
        // // winds.forEach(element => {
        // //     this.HideWindowImmediatelyByType(element, dispose)
        // // });
        // let winds = this.GetAllWind(false, containDotDel)
        // winds.forEach(element =>
        // {
        //     if (dispose)
        //         element.dispose()
        //     else
        //         fgui.GRoot.inst.hideWindowImmediately(element)
        // });
        // fgui.GRoot.inst.hidePopup()
    };
    /**
     * 显示窗口到最前面
     * @param wind 需要显示的窗口
     */
    UIMgr.prototype.BringToFront = function (wind) {
        // let cnt = this.node.childrenCount;
        // let i = cnt - 1;
        // // if (this.mModeLayer.parent != null && !wind.modal)
        // // {
        // //     i = this.mModeLayer.getSiblingIndex() + 1
        // // }
        // for (; i >= 0; i--) {
        //     let g = this.node.children[i].getComponent(BaseUI)
        //     if (g != null) {
        //         if (g == wind) { return; }
        //         else break
        //     }
        // }
        // if (wind != null) {
        //     if (!wind.IsTop) {
        //         if (i >= 0)
        //             wind.node.setSiblingIndex(i)
        //     }
        // }
    };
    UIMgr.prototype.ShowModalWait = function (param) {
        if (param === void 0) { param = null; }
        // if (UIConfig.globalModalWaiting != null) {
        //     this.ShowWind(UIConfig.globalModalWaiting, param)
        // }
        fgui.GRoot.inst.showModalWait(param);
        console.log("msg =" + param);
    };
    UIMgr.prototype.CloseModalWait = function () {
        fgui.GRoot.inst.closeModalWait();
        // if (UIConfig.globalModalWaiting != null) {
        //     this.HideWind(UIConfig.globalModalWaiting)
        // }
    };
    /**
     * 创建一个黑背景
     */
    UIMgr.prototype.createModalLayer = function () {
        this.mModeLayer = new cc.Node("ModalLayer");
        var sp = this.mModeLayer.addComponent(cc.Sprite);
        var xx = new cc.SpriteFrame("res/raw-internal/image/default_sprite_splash.png");
        sp.spriteFrame = xx;
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        this.node.addChild(this.mModeLayer);
        var ww = this.mModeLayer.addComponent(cc.Widget);
        ww.isAlignBottom = true;
        ww.isAlignTop = true;
        ww.isAlignLeft = true;
        ww.isAlignRight = true;
        ww.bottom = 0;
        ww.top = 0;
        ww.left = 0;
        ww.right = 0;
        this.mModeLayer.color = cc.color(UIConfig.modalLayerColor.getR(), UIConfig.modalLayerColor.getG(), UIConfig.modalLayerColor.getB());
        this.mModeLayer.opacity = UIConfig.modalLayerColor.getA();
    };
    UIMgr.prototype.AdjustModalLayer = function () {
        // if (this.mModeLayer == null) this.createModalLayer()
        // let cnt = this.node.childrenCount - 1;
        // for (var index = cnt; index >= 0; index--) {
        //     var element = this.node.children[index].getComponent(BaseUI)
        //     if (element != null && element.modal) {
        //         this.mModeLayer.active = false
        //         if (this.mModeLayer.parent == null) {
        //             this.node.insertChild(this.mModeLayer, index)
        //         }
        //         else {
        //             if (index > 0) {
        //                 if (element.IsTop)
        //                     this.mModeLayer.setSiblingIndex(index - 1)
        //                 else
        //                     this.mModeLayer.setSiblingIndex(index)
        //             }
        //             else
        //                 this.mModeLayer.setSiblingIndex(0)
        //         }
        //         this.mModeLayer.active = true
        //         return
        //     }
        // }
        // this.node.removeChild(this.mModeLayer)
    };
    var UIMgr_1;
    UIMgr.UIStartScale = 0.6;
    UIMgr.mInstance = null;
    UIMgr = UIMgr_1 = __decorate([
        ccclass
    ], UIMgr);
    return UIMgr;
}(DispatchEventNode_1.DispatchEventNode));
exports.UIMgr = UIMgr;
// export class BaseUI extends fgui.GComponent
// {
// }
var BaseUI = /** @class */ (function (_super) {
    __extends(BaseUI, _super);
    function BaseUI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.eventMgr = null;
        _this.uiName = "";
        _this.btnCloseNodeName = "BtnClose";
        _this.packName = "";
        _this.resName = "Main";
        _this.modal = false;
        _this.dontDel = false;
        _this.mParam = null;
        _this.UIObj = new Map();
        _this.UICtrls = new Map();
        _this.btnNameStartsWith = "Btn";
        _this.isNeedShowAnimation = false;
        _this.isNeedHideAnimation = false;
        _this.prefabUrl = "";
        _this.clickBbackgroundClose = false;
        return _this;
    }
    Object.defineProperty(BaseUI.prototype, "IsTop", {
        /**
         * 是否在顶层
         */
        get: function () {
            return this.node.parent != null && this.node.getSiblingIndex() == this.node.parent.childrenCount - 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseUI.prototype, "IsShowing", {
        get: function () {
            return this.node.parent != null;
        },
        enumerable: true,
        configurable: true
    });
    BaseUI.prototype.Init = function (param) {
        var _this = this;
        this.eventMgr = new EventListenerMgr_1.InterchangeableEventListenerMgr(this, this.OnHandler);
        this.mParam = param;
        //fairygui
        if (this.contentPane == null) {
            var windObj = fgui.UIPackage.createObject(this.packName, this.resName);
            windObj.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
            this.contentPane = windObj.asCom;
        }
        this.center();
        this.UIObj.clear();
        this.UICtrls.clear();
        for (var index = 0; index < this.contentPane.numChildren; index++) {
            var element = this.contentPane.getChildAt(index);
            if (element.name.startsWith(this.btnNameStartsWith)) {
                if (element.name == "BtnClose") {
                    element.on("click", this.OnBtnClose, this);
                }
                else {
                    element.on("click", this.OnBtnClick, this);
                }
            }
            this.UIObj.set(element.name, element);
        }
        this.contentPane.controllers.forEach(function (element) {
            _this.UICtrls.set(element.name, element);
        });
        this.setPivot(0.5, 0.5);
        this.OninitWind();
        // let prefab = ResMgr.Instance.GetRes(this.prefabUrl)
        // if (prefab != null) {
        //     this.contentPane = cc.instantiate(prefab)
        //     this.contentPane.active = false
        //     this.contentPane.parent = this.node
        //     this.contentPane.active = true
        //     this.contentPane.x = 0
        //     this.contentPane.y = 0
        //     this.contentPane.setContentSize(this.node.getContentSize())
        // }
        // else {
        //     console.error("实例化对象失败：url=" + this.prefabUrl)
        //     return
        // }
        // this.UIObj.clear()
        // let nodes = this.FindAllChildren(this.contentPane)
        // nodes.forEach(element => {
        //     if (element.name.startsWith(this.btnNameStartsWith)) {
        //         //let btn = element.getComponent(cc.Button)
        //         if (element.name == "BtnClose") {
        //             element.on("click", this.OnBtnClose, this)
        //         }
        //         else {
        //             element.on("click", this.OnBtnClick, this)
        //         }
        //     }
        //     this.UIObj.set(element.name, element)
        // });
        // if (this.clickBbackgroundClose && this.modal) {
        //     this.node.on("click", this.OnBtnClose, this)
        // }
        // this.OnInit(param)
    };
    BaseUI.prototype.FindAllChildren = function (root) {
        var _this = this;
        var list = new Array();
        list.push(root);
        if (root.childrenCount <= 0) {
            return list;
        }
        root.children.forEach(function (element) {
            var xx = _this.FindAllChildren(element);
            xx.forEach(function (e) {
                list.push(e);
            });
        });
        return list;
    };
    BaseUI.prototype.Shown = function (param) {
        this.mParam = param;
        if (this.isNeedShowAnimation)
            this.DoShowAnimation();
        else
            this.OnShown(param);
    };
    BaseUI.prototype.Hide = function () {
        if (this.isNeedHideAnimation)
            this.DoHideAnimation();
        else
            this.OnHide();
    };
    BaseUI.prototype.OnShown = function (Param) {
        this.OnShowWind();
    };
    BaseUI.prototype.OnHide = function () {
        this.mParam = null;
        this.data = null;
        // UIMgr.Instance.HideWindowImmediately(this, false)
        this.eventMgr.RemoveAll();
        this.OnHideWind();
    };
    BaseUI.prototype.OnHandler = function (ev) {
    };
    BaseUI.prototype.DoShowAnimation = function () {
        var _this = this;
        if (this.isNeedHideAnimation) {
            this.scaleX = 0;
            this.scaleY = 0;
            fgui.GTween.to(this.scaleX, 1, 0.3)
                .setEase(fgui.EaseType.BounceOut)
                .onUpdate(function (v) {
                _this.setScale(v.value.x, v.value.x);
            }, this)
                .onComplete(function () {
                _super.prototype.doShowAnimation.call(_this);
            }, this);
        }
        else {
            _super.prototype.doShowAnimation.call(this);
        }
        // this.OnShown(this.mParam)
    };
    BaseUI.prototype.DoHideAnimation = function () {
        var _this = this;
        // this.OnHide()
        if (this.isNeedHideAnimation) {
            this.setScale(UIMgr.UIStartScale, UIMgr.UIStartScale);
            fgui.GTween.to(this.scaleX, 0, 0.3)
                .onUpdate(function (v) {
                _this.setScale(v.value.x, v.value.x);
            }, this)
                .onComplete(function () {
                _super.prototype.doHideAnimation.call(_this);
            }, this);
        }
        else {
            _super.prototype.doHideAnimation.call(this);
        }
    };
    BaseUI.prototype.OnInit = function (param) {
    };
    BaseUI.prototype.OnBtnClick = function (ev) {
    };
    BaseUI.prototype.OnBtnClose = function () {
        this.Hide();
    };
    return BaseUI;
}(fgui.Window));
exports.BaseUI = BaseUI;
