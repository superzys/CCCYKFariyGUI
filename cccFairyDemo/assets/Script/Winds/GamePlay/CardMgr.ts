import { CardItem } from "./CardItem";

const { ccclass, property } = cc._decorator;

@ccclass
export class CardMgr
{
    private url = "ui://GamePack/CardMode"
    private mPools: fgui.GObjectPool
    private static mInstance: CardMgr
    public constructor()
    {
        if (CardMgr.mInstance == null) CardMgr.mInstance = this
        this.mPools = new fgui.GObjectPool()
        fgui.UIObjectFactory.setPackageItemExtension(this.url, CardItem)
    }
    public static get Instance()
    {
        if (this.mInstance == null) new CardMgr()
        return this.mInstance
    }

    public Get(data: ShowCardItemData)
    {
        let obj: CardItem = this.mPools.getObject(this.url) as CardItem
        if (obj != null)
        {
            obj.Use(data)
        }
    }

    public Return(obj: CardItem)
    {
        if (obj != null)
        {
            obj.UnUse()
        }
        this.mPools.returnObject(obj)
    }

    public Clear()
    {
        this.mPools.clear()
    }
}

export class ShowCardItemData
{
    public isShow: boolean = true
    public id: number = 0x00
    public parent: fgui.GRoot = null
    public x: number = 0
    public y: number = 0
    public scal = 1
}