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
var DDZLogic_1 = require("../../Modes/DDZLogic");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var CardItem = /** @class */ (function (_super) {
    __extends(CardItem, _super);
    function CardItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CardItem.prototype.constructFromXML = function (xml) {
        this.back = this.getController("back");
        this.hua = this.getController("hua");
        this.blackNum = this.getChild("blackNum").asTextField;
        this.redNum = this.getChild("redNum").asTextField;
    };
    CardItem.prototype.Use = function (data) {
        if (data.isShow) {
            this.back.selectedIndex = 1;
            var info = DDZLogic_1.DDZLogic.GetColorTypeAndValue(data.id);
            if (info.value == 0x0E || info.value == 0x0F) {
                if (info.value == 0xE) {
                    info.color = 4;
                }
                else {
                    info.color = 5;
                }
                info.value = 0x0E;
            }
            this.hua.selectedIndex = info.color;
            this.redNum.text = info.value.toString(16);
            this.blackNum.text = this.redNum.text;
        }
        else {
            this.back.selectedIndex = 0;
        }
        // this.parent = data.parent
        data.parent.addChild(this);
        this.setScale(data.scal, data.scal);
        this.setPosition(data.x, data.y);
    };
    CardItem.prototype.UnUse = function () {
        // this.parent = null
        this.removeFromParent();
    };
    CardItem.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    CardItem = __decorate([
        ccclass
    ], CardItem);
    return CardItem;
}(fgui.GComponent));
exports.CardItem = CardItem;
