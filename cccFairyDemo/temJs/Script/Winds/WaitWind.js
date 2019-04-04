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
var TimeDelay_1 = require("../../YK/core/Util/TimeDelay");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var WaitWind = /** @class */ (function (_super) {
    __extends(WaitWind, _super);
    function WaitWind() {
        return _super.call(this) || this;
    }
    WaitWind.prototype.onInit = function () {
        // super.constructFromXML(xml);
        // this.displayObject.on(Laya.Event.DISPLAY, this, this.__onShown);
        // this.displayObject.on(Laya.Event.UNDISPLAY, this, this.__onHidden);
        // this.lablMsg = this.getChild("lablMsg").asTextField
        // this.lablMsg = this.getChild("lablMsg").asTextField
        // this.state = this.getController("c1")
    };
    Object.defineProperty(WaitWind.prototype, "text", {
        set: function (value) {
            if (value != null) {
                this.lablMsg.text = value;
            }
            else {
                this.lablMsg.text = "";
            }
        },
        enumerable: true,
        configurable: true
    });
    WaitWind.prototype.__onShown = function () {
        TimeDelay_1.TimeDelay.Instance.Remove(this.ShownLoadingRing, this);
        TimeDelay_1.TimeDelay.Instance.Remove(this.TimeOut, this);
        TimeDelay_1.TimeDelay.Instance.Add(1, 1, this.ShownLoadingRing, this);
        TimeDelay_1.TimeDelay.Instance.Add(10, 1, this.TimeOut, this);
        this.state.selectedIndex = 1;
    };
    WaitWind.prototype.__onHidden = function () {
        TimeDelay_1.TimeDelay.Instance.Remove(this.ShownLoadingRing, this);
        TimeDelay_1.TimeDelay.Instance.Remove(this.TimeOut, this);
    };
    WaitWind.prototype.ShownLoadingRing = function () {
        this.state.selectedIndex = 0;
    };
    /**
     * 十秒自动关闭
     */
    WaitWind.prototype.TimeOut = function () {
        fgui.GRoot.inst.closeModalWait();
    };
    WaitWind = __decorate([
        ccclass
    ], WaitWind);
    return WaitWind;
}(fgui.GComponent));
exports.WaitWind = WaitWind;
