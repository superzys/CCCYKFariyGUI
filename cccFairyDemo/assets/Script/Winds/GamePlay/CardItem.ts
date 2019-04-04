import { DDZLogic } from "../../Modes/DDZLogic";
import { ShowCardItemData } from "./CardMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export class CardItem extends fgui.GComponent
{
    private back: fgui.Controller
    private hua: fgui.Controller
    private blackNum: fgui.GTextField
    private redNum: fgui.GTextField
    protected constructFromXML(xml: any): void
    {
        this.back = this.getController("back")
        this.hua = this.getController("hua")
        this.blackNum = this.getChild("blackNum").asTextField
        this.redNum = this.getChild("redNum").asTextField
    }
    public Use(data: ShowCardItemData)
    {
        if (data.isShow)
        {
            this.back.selectedIndex = 1
            let info = DDZLogic.GetColorTypeAndValue(data.id)
            if (info.value == 0x0E || info.value == 0x0F)
            {
                if (info.value == 0xE)
                {
                    info.color = 4
                }
                else
                {
                    info.color = 5
                }
                info.value = 0x0E
            }
            this.hua.selectedIndex = info.color
            this.redNum.text = info.value.toString(16)
            this.blackNum.text = this.redNum.text
        }
        else
        {
            this.back.selectedIndex = 0
        }
        // this.parent = data.parent
        data.parent.addChild(this);
        this.setScale(data.scal,data.scal)
        this.setPosition(data.x, data.y)
    }

    public UnUse()
    {
        // this.parent = null
        this.removeFromParent();
    }

    public dispose()
    {
        super.dispose()
    }
}