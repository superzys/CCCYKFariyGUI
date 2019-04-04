"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var DDZLogic = /** @class */ (function () {
    function DDZLogic() {
        this.CFG = {
            MAX_SHUN: 14,
            MAX_ZHA: 16
        };
    }
    DDZLogic.GetColorTypeAndValue = function (cardid) {
        var color = cardid >> 4;
        var value = cardid & 0x0F;
        return { color: color, value: value };
    };
    DDZLogic.prototype.GetCardIndex = function (card) {
        var c = card & 0x0f;
        if (c == 0x01)
            c = 14;
        else if (c == 0x02)
            c = 16;
        else if (c == 0x0E)
            c = 17;
        else if (c == 0x0F)
            c = 18;
        return c;
    };
    /**
     * 获取牌的类型
     * @param outCards 外部
     */
    DDZLogic.prototype.GetCardType = function (outCards) {
        var _this = this;
        var tmpCards = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
        outCards.forEach(function (element) {
            var index = _this.GetCardIndex(element);
            tmpCards[index] = tmpCards[index] + 1;
        });
        var counts = [0, 0, 0, 0];
        var cards = [[], [], [], []];
        for (var index = 0; index < tmpCards.length; index++) {
            var c = tmpCards[index];
            if (c > 0) {
                counts[c] = counts[c] + 1;
                cards[c].push(cards[c], index + 1);
            }
        }
        if (counts[3] != 0)
            return this.GetType4(counts, cards);
        else if (counts[2] != 0)
            return this.GetType3(counts, cards);
        else if (counts[1] != 0)
            return this.GetType2(counts, cards);
        else if (counts[0] != 0)
            return this.GetType1(counts, cards);
    };
    /**
     * 判断四张相同的牌的组合
     * @param counts 1,2,3,4组合的数目
     * @param cards 数目分别为1,2,3,4的牌
     */
    DDZLogic.prototype.GetType4 = function (counts, cards) {
        var ret = null;
        var sp = this.SplitCards(counts, cards);
        var lastCard = sp.cs_4[sp.cs_4.length - 1];
        var otherSum = sp.count3Num * 3 + sp.count2Num * 2 + sp.count1Num; //剩余的牌张数  除了炸弹
        if (sp.count4Num == 1) {
            if (otherSum == 0) {
                ret = new CardTypeInfo(CardType.t_4, lastCard);
            }
            else if (otherSum == 2) //此处要注意能不能出现四代二是一个对子的两个
             {
                ret = new CardTypeInfo(CardType.t_42, lastCard);
            }
            else if (otherSum == 4 && sp.count2Num == 2) {
                ret = new CardTypeInfo(CardType.t_422, lastCard);
            }
        }
        if (ret == null) {
            if (sp.count3Num > 1 && this.IsContinue(sp.cs_3)) //三张的个数大于三才有可能是飞机 那么可能就是飞机做了翅膀
             {
                //炸弹当单牌
                if (sp.count3Num == 4) {
                    if (sp.count2Num + sp.count1Num == 0) //如果有三个三张的那么就不能有多余的牌了
                     {
                        ret = new CardTypeInfo(CardType.t_31n, sp.cs_3[sp.cs_3.length - 1], sp.count3Num);
                    }
                }
                else if (sp.count3Num == (2 + sp.count2Num) && sp.count1Num == 0) {
                    ret = new CardTypeInfo(CardType.t_32n, sp.cs_3[sp.cs_3.length - 1], sp.count3Num);
                }
            }
            if (ret == null) {
                if (sp.count4Num == 2 && otherSum == 0) {
                    ret = new CardTypeInfo(CardType.t_422, sp.cs_4[sp.cs_4.length - 1], sp.count3Num);
                }
            }
            if (ret == null) {
                if ((otherSum + sp.count4Num * 4) % 4 == 0) {
                    for (var index = 0; index < sp.count4Num; index++) {
                        var c = sp.cs_4.splice(0, 1);
                        sp.cs_3.push(c[0]);
                        sp.cs_1.push(c[0]);
                        counts[3]--;
                        counts[2]++;
                        counts[0]++;
                    }
                    sp.cs_3.sort(function (a, b) {
                        if (a < b)
                            return -1;
                        else if (a == b)
                            return 0;
                        else
                            return 1;
                    });
                    return this.GetType3(counts, cards);
                }
            }
        }
        return ret;
    };
    DDZLogic.prototype.GetType3 = function (counts, cards) {
        var ret = null;
        var sp = this.SplitCards(counts, cards);
        var lastCard = sp.cs_3[sp.cs_3.length - 1];
        var otherSum = sp.count2Num * 2 + sp.count1Num;
        if (sp.count3Num == 1) {
            if (sp.count2Num == 1 && sp.count1Num == 0) {
                ret = new CardTypeInfo(CardType.t_32, lastCard);
            }
            else if (sp.count2Num == 0 && sp.count1Num == 1) {
                ret = new CardTypeInfo(CardType.t_31, lastCard);
            }
            else if (sp.count2Num == 0 && sp.count1Num == 0) {
                ret = new CardTypeInfo(CardType.t_3, lastCard);
            }
        }
        if (ret == null) {
            var sum = sp.count1Num + sp.count2Num * 2 + sp.count3Num * 3;
            var max = this.GetMaxContinue(sp.cs_3);
            if (max.length >= 2) {
                if (sum / 3 == max.length && sp.count3Num == max.length) {
                    ret = new CardTypeInfo(CardType.t_3n, max[max.length - 1]);
                }
                else if (sum / 4 == max.length) {
                    ret = new CardTypeInfo(CardType.t_31n, max[max.length - 1]);
                }
            }
            if (ret == null) {
                //特殊型3334445556667778
                if (max.length == 5 && sum == 16)
                    ret = new CardTypeInfo(CardType.t_31n, max[max.length - 1]);
                else if (max.length == 6 && sum == 20)
                    ret = new CardTypeInfo(CardType.t_31n, max[max.length - 1]);
            }
        }
        return ret;
    };
    DDZLogic.prototype.GetType2 = function (counts, cards) {
        var ret = null;
        if (counts[0] == 0) {
            if (counts[1] == 1) {
                ret = new CardTypeInfo(CardType.t_2, cards[1][cards[1].length - 1]);
            }
            if (this.IsContinue(cards[1]) && counts[1] > 2) {
                ret = new CardTypeInfo(CardType.t_2n, cards[1][cards[1].length - 1], counts[2]);
            }
        }
    };
    DDZLogic.prototype.GetType1 = function (counts, cards) {
        var ret = null;
        var count = counts[0];
        if (count == 1) {
            ret = new CardTypeInfo(CardType.t_1, cards[0][cards[0].length - 1]);
        }
        else {
            if (count == 2 && cards[0][0] == 17 && cards[0][1] == 18) {
                ret = new CardTypeInfo(CardType.t_king, cards[0][1]);
            }
            if (ret == null) {
                if (cards[0].length >= 5 && this.IsContinue(cards[0])) {
                    ret = new CardTypeInfo(CardType.t_king, cards[0][cards[0].length - 1], cards[0].length);
                }
            }
        }
        return ret;
    };
    DDZLogic.prototype.SplitCards = function (counts, cards) {
        /**
         * 所有单牌
         */
        var cs_1 = cards[0];
        /**
         * 对子
         */
        var cs_2 = cards[1];
        /**
         * 三张的
         */
        var cs_3 = cards[2];
        /**
         * 四张相同的
         */
        var cs_4 = cards[3];
        var count4Num = counts[3];
        var count3Num = counts[2];
        var count2Num = counts[1];
        var count1Num = counts[0];
        return {
            cs_1: cs_1, cs_2: cs_2, cs_3: cs_3, cs_4: cs_4,
            count4Num: count4Num, count3Num: count3Num, count2Num: count2Num, count1Num: count1Num
        };
    };
    /**
     * 是否连续的牌
     * @param cards 牌列表
     */
    DDZLogic.prototype.IsContinue = function (cards) {
        var last = -1;
        for (var index = 0; index < cards.length; index++) {
            var element = cards[index];
            if (last != -1 && last + 1 != element) {
                return false;
            }
            last = element;
        }
        return true;
    };
    /**
     *
     * @param cards 获取最大能连的牌
     */
    DDZLogic.prototype.GetMaxContinue = function (cards) {
        var all = new Array();
        var temp = new Array();
        for (var index = 0; index < cards.length; index++) {
            var element = cards[index];
            if (temp.length > 0 && temp[temp.length - 1] == element - 1) {
                temp.push(element);
            }
            else {
                if (temp.length > 0) {
                    all.push(temp);
                }
                temp = new Array();
                temp.push(element);
            }
        }
        var m = null;
        all.forEach(function (element) {
            if (m == null)
                m = element;
            else if (element.length >= m.length) {
                m = element;
            }
        });
        return m;
    };
    /**
     * 是不是能压得过
     * @param info1 牌的类型
     * @param info2 牌的类型
     */
    DDZLogic.prototype.IsBig = function (info1, info2) {
    };
    DDZLogic.CardPools = [
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d,
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d,
        0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d,
        0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x3b, 0x3c, 0x3d,
        0x0E, 0x0F
    ];
    DDZLogic = __decorate([
        ccclass
    ], DDZLogic);
    return DDZLogic;
}());
exports.DDZLogic = DDZLogic;
/**
 * 牌的类型
 */
var CardType;
(function (CardType) {
    /**
     * 单张
     */
    CardType[CardType["t_1"] = 0] = "t_1";
    /**
     * 顺子
     */
    CardType[CardType["t_1n"] = 1] = "t_1n";
    /**
     * 对子
     */
    CardType[CardType["t_2"] = 2] = "t_2";
    /**
     * 连对
     */
    CardType[CardType["t_2n"] = 3] = "t_2n";
    /**
     * 三不带
     */
    CardType[CardType["t_3"] = 4] = "t_3";
    /**
     * 飞机不带
     */
    CardType[CardType["t_3n"] = 5] = "t_3n";
    /**
     * 三带一
     */
    CardType[CardType["t_31"] = 6] = "t_31";
    /**
     * 飞机带单牌
     */
    CardType[CardType["t_31n"] = 7] = "t_31n";
    /**
     * 三带二
     */
    CardType[CardType["t_32"] = 8] = "t_32";
    /**
    * 飞机带对
    */
    CardType[CardType["t_32n"] = 9] = "t_32n";
    /**
     * 炸弹
     */
    CardType[CardType["t_4"] = 10] = "t_4";
    /**
     * 四带二
     */
    CardType[CardType["t_42"] = 11] = "t_42";
    /**
     * 四带两对
     */
    CardType[CardType["t_422"] = 12] = "t_422";
    /**
     * 王炸
     */
    CardType[CardType["t_king"] = 13] = "t_king";
})(CardType || (CardType = {}));
/**
 * 牌的花色
 */
var CardColor;
(function (CardColor) {
    /**
     * 黑
     */
    CardColor[CardColor["Hei"] = 0] = "Hei";
    /**
     * 红
     */
    CardColor[CardColor["Hong"] = 1] = "Hong";
    /**
     * 梅
     */
    CardColor[CardColor["Mei"] = 2] = "Mei";
    /**
     * 方片
     */
    CardColor[CardColor["Fang"] = 3] = "Fang";
})(CardColor || (CardColor = {}));
/**
 * 牌的类型信息
 */
var CardTypeInfo = /** @class */ (function () {
    function CardTypeInfo(type, card, n) {
        if (n === void 0) { n = 0; }
        /**
         * 牌型
         */
        this.type = null;
        /**
         * 最大的牌
         */
        this.card = null;
        /**
         * 连着的长度
         */
        this.n = 0;
        this.type = type;
        this.card = card;
        this.n = n;
    }
    return CardTypeInfo;
}());
