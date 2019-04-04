import { BaseUI } from "../../YK/core/UIMgr/UIMgr";
import { EventData } from "../../YK/core/EventMgr/DispatchEventNode";

const { ccclass, property } = cc._decorator;

@ccclass
export class MainWind extends BaseUI
{
    protected packName = "MainPack"
    protected resName = "MainWindow"
    public modal: boolean = false
    protected btnNameStartsWith: string = "Btn"
    protected isNeedShowAnimation: boolean = false
    protected isNeedHideAnimation: boolean = false
    protected OninitWind()
    {
        
    }

    protected OnShowWind()
    {
    }

    protected OnHideWind()
    {

    }
    protected OnHandler(ev: EventData)
    {
    }
}