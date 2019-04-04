import { SceneBase } from "../../YK/core/SceneMgr/SceneBase";
import { EventData } from "../../YK/core/EventMgr/DispatchEventNode";
import { LoadingWind } from "../Winds/LoadingWind";
import { LoginWind } from "../Winds/LoginWind";


const { ccclass, property } = cc._decorator;

@ccclass
export class LoginScene extends SceneBase
{
    protected firstWind: any = LoginWind
    protected OnInit(param: any)
    {
        super.OnInit(param)
        this.needLoadRes
        .add("ui/LoginPack.bin", true, true)
        .add("ui/BasePack.bin", true, true)
        .add("ui/BasePack_atlas0.png", true)
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
