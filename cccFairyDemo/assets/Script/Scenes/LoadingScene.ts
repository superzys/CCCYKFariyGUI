import { LoadGruopInfo } from "../../YK/core/ResMgr/ResMgr";
import { SceneBase } from "../../YK/core/SceneMgr/SceneBase";
import { NetMgr } from "../../YK/core/Net/NetMgr";
import { UIMgr } from "../../YK/core/UIMgr/UIMgr";
import { ProtoMap } from "../../YK/core/Net/ProtoMap";
import { SceneMgr } from "../../YK/core/SceneMgr/SceneMgr";
import { LoginScene } from "./LoginScene";
import { EventData } from "../../YK/core/EventMgr/DispatchEventNode";
import { LoadingProgressEvenet } from "../Defs/EventDef";
import { WaitWind } from "../Winds/WaitWind";
import { LoadingWind } from "../Winds/LoadingWind";
import { ProtocolDef } from "../Defs/ProtocolDef";

const { ccclass, property } = cc._decorator;

@ccclass
export class LoadingScene extends SceneBase
{
    private initNeedLoadTask: LoadGruopInfo
    protected OnInit(param: any)
    {
        super.OnInit(param)
        this.needLoadRes
        .add("ui/Loading_atlas_vckm32.jpg", true)
            .add("ui/Loading_atlas0.png", true)
            .add("ui/Loading.bin", true, true)

        this.initNeedLoadTask = new LoadGruopInfo()

        this.initNeedLoadTask.add("ui/BasePack_atlas0.png", true)
            .add("ui/BasePack.bin", true, true)
            .onItemCompletion(this.loadItemCompletion, this)
            .onCompletion(this.loadGameResFinish, this)
    }


    private loadItemCompletion()
    {
        console.log(this.initNeedLoadTask.Progress)
        let ev = new LoadingProgressEvenet();
        ev.Progress = this.initNeedLoadTask.Progress
        UIMgr.Instance.DispatchEvent(ev)
    }

    /**
     * 资源加载完成
     */
    private loadGameResFinish()
    {
        NetMgr.Instance.AddProto("NetPack.proto", ProtocolDef.ProtocolNames)

        fgui.UIObjectFactory.setPackageItemExtension(fgui.UIConfig.globalModalWaiting,WaitWind)
        this.AddProto()
        ProtocolDef.Protocols.forEach(element =>
        {
            ProtoMap.AddProto(element)
        });
    }

    private AddProto()
    {
        NetMgr.Instance.AddProto("netpack", ProtocolDef.ProtocolNames)
        this.StartGame()
    }


    public StartGame()
    {
        let ev = new LoadingProgressEvenet();
        ev.Progress = 100
        UIMgr.Instance.DispatchEvent(ev)
        SceneMgr.Instance.GoToScene(LoginScene)
    }

    protected OnEnter(param: any)
    {
        super.OnEnter(param)
        UIMgr.Instance.ShowWind(LoadingWind)
        this.initNeedLoadTask.start()
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
