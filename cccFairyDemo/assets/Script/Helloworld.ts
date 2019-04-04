import { NetMgr } from "../YK/core/Net/NetMgr";
import { ModeMgr } from "../YK/core/ModeMgr/ModeMgr";
import { SceneMgr } from "../YK/core/SceneMgr/SceneMgr";
import { RoleMode } from "./Modes/RoleMode";
import { LoadingScene } from "./Scenes/LoadingScene";
import { ProtocolDef } from "./Defs/ProtocolDef";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    // view显示节点
    private _viewNode: cc.Node;
    onLoad() {
        fgui.addLoadHandler();
        fgui.GRoot.create();
        // 显示节点包装，未后面的适配做准备
        this._viewNode = new cc.Node();
        this._viewNode.name = 'stage';
        this._viewNode.parent = cc.director.getScene();
        fgui.GRoot.inst.node.parent = this._viewNode;
    }

    start () {
        // init logic
        this.label.string = this.text;

        fgui.UIConfig.globalModalWaiting = "ui://Loading/waitWind"
        // NetMgr.Instance.AddProto("NetPack.proto", ProtocolDef.ProtocolNames)
        ModeMgr.Instance.AddMode<RoleMode>(RoleMode)
        ModeMgr.Instance.InitData()
        SceneMgr.Instance.GoToScene(LoadingScene)
        
    }
}
