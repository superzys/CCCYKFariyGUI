"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var CardItem_1 = require("./CardItem");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var CardMgr = /** @class */ (function () {
    function CardMgr() {
        this.url = "ui://GamePack/CardMode";
        if (CardMgr_1.mInstance == null)
            CardMgr_1.mInstance = this;
        this.mPools = new fgui.GObjectPool();
        fgui.UIObjectFactory.setPackageItemExtension(this.url, CardItem_1.CardItem);
    }
    CardMgr_1 = CardMgr;
    Object.defineProperty(CardMgr, "Instance", {
        get: function () {
            if (this.mInstance == null)
                new CardMgr_1();
            return this.mInstance;
        },
        enumerable: true,
        configurable: true
    });
    CardMgr.prototype.Get = function (data) {
        var obj = this.mPools.getObject(this.url);
        if (obj != null) {
            obj.Use(data);
        }
    };
    CardMgr.prototype.Return = function (obj) {
        if (obj != null) {
            obj.UnUse();
        }
        this.mPools.returnObject(obj);
    };
    CardMgr.prototype.Clear = function () {
        this.mPools.clear();
    };
    var CardMgr_1;
    CardMgr = CardMgr_1 = __decorate([
        ccclass
    ], CardMgr);
    return CardMgr;
}());
exports.CardMgr = CardMgr;
var ShowCardItemData = /** @class */ (function () {
    function ShowCardItemData() {
        this.isShow = true;
        this.id = 0x00;
        this.parent = null;
        this.x = 0;
        this.y = 0;
        this.scal = 1;
    }
    return ShowCardItemData;
}());
exports.ShowCardItemData = ShowCardItemData;
