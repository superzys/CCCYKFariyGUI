import { SceneBase } from "../../YK/core/SceneMgr/SceneBase";
import { EventData } from "../../YK/core/EventMgr/DispatchEventNode";
import { MainWind } from "../Winds/MainWind";

const { ccclass, property } = cc._decorator;


@ccclass
export class MainScene extends SceneBase
{
    protected firstWind: any = MainWind
    protected OnInit(param: any)
    {
        super.OnInit(param)
        this.needLoadRes.add("ui/MainPack_atlas0.png"
            , true)

        this.needLoadRes.add("ui/MainPack.bin"
           , true, true)
    }

    protected OnEnter(param: any)
    {
        super.OnEnter(param)
    }

    protected OnHandler(ev: EventData)
    {
        super.OnHandler(ev)
    }

    protected OnLeave()
    {
        super.OnLeave()
    }

    protected OnDestroy()
    {
        super.OnDestroy()
    }

    protected OnLoaded()
    {
        super.OnLoaded()
    }

    protected OnTaskFinished()
    {
        super.OnTaskFinished()
    }
}