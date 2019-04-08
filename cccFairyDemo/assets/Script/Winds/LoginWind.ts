// import { BaseUI, UIMgr } from "../../YK/core/UIMgr/UIMgr";
import { MessageBox } from "./MessageBox";
import { LoadingWind } from "./LoadingWind";
// import { NetMgrEventDef, HttpRespData, NetMgr } from "../../YK/core/Net/NetMgr";
// import { ModeMgr } from "../../YK/core/ModeMgr/ModeMgr";
import { RoleMode } from "../Modes/RoleMode";
// import { Func, EventData } from "../../YK/core/EventMgr/DispatchEventNode";
// import { ResponseDataInfo, ResponseMessageEvent } from "../../YK/core/Net/ResponseMessageEvent";
import { MainScene } from "../Scenes/MainScene";
// import { SceneMgr } from "../../YK/core/SceneMgr/SceneMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export class LoginWind extends YK.BaseUI
{
    protected packName = "LoginPack"
    protected resName = "LoginWindow"
    public modal: boolean = false
    public dontDel: boolean = true
    protected btnNameStartsWith: string = "Btn"
    protected isNeedShowAnimation: boolean = false
    protected isNeedHideAnimation: boolean = false

    private mLabelAcc: fgui.GTextField
    private mLabelPass: fgui.GTextField

    protected OninitWind()
    {
        this.eventMgr.setNetCallback(this.OnNetMsg)
        this.mLabelAcc = this.UIObj.get("LabelAcc").asTextField
        this.mLabelPass = this.UIObj.get("LabelPass").asTextField
    }

    protected OnShowWind()
    {
       YK. UIMgr.Instance.HideWind(LoadingWind)
        this.eventMgr.addNetEvent(200);
        this.eventMgr.addNetEvent(YK.NetMgrEventDef.onopen)
        this.eventMgr.addNetEvent(YK.NetMgrEventDef.onerror)
        this.eventMgr.addModeEvent(YK.ModeMgr.EventType.SENDINITMSGOK)
    }

    protected OnHideWind()
    {

    }

    protected OnBtnClick(ev:  cc.Event.EventCustom)
    {
        super.OnBtnClick(ev)
        if (ev.currentTarget.$gobj.name == "BtnLogin")
        {
            this.HttpLogin()
        }
    }


    public HttpLogin()
    {
        this.OnInitMsged()
            return;
        if (this.mLabelAcc.text == "" || this.mLabelPass.text == "")
        {
            MessageBox.Create("请输入账号密码").Show()
        }
        else
        {
            YK.UIMgr.Instance.ShowModalWait()
            YK.ModeMgr.Instance.GetMode<RoleMode>(RoleMode).SendHttpLogin(this.mLabelAcc.text,
                this.mLabelPass.text,
                new YK.Func(this, (res: YK.HttpRespData) =>
                {

                    if (res != null)
                    {
                        if (res.errorcode == 0)
                        {
                            this.ConnectServer()
                        }
                        else
                        {
                            YK.UIMgr.Instance.CloseModalWait()
                            MessageBox.Create(res.msg).Show()
                        }
                    }
                    else
                    {
                        YK.UIMgr.Instance.CloseModalWait()
                        MessageBox.Create("登陆失败尝试重新登陆").Show()
                    }
                }))
        }
    }

    public ConnectServer()
    {
        YK.NetMgr.Instance.connect()
    }

    public OnConnetServer()
    {
        YK. ModeMgr.Instance.GetMode<RoleMode>(RoleMode).SendLogin()
    }

    public OnLogin(ev: YK.ResponseDataInfo)
    {
        YK. UIMgr.Instance.CloseModalWait()
        if (ev.head.errorcode == 0)
        {
            YK.UIMgr.Instance.ShowModalWait()
            YK.ModeMgr.Instance.SendInitMsg()
        }
        else
        {
            MessageBox.Create(ev.msg).Show()
        }
    }


    public OnInitMsged()
    {
        console.error("开始游戏")
        YK.UIMgr.Instance.CloseModalWait()

        YK.SceneMgr.Instance.GoToScene(MainScene)
    }

    public OnConnetServerError(error: string)
    {
        MessageBox.Create("链接服务器失败，尝试重连")
            .SetBtnConfirmCallBack(new YK.Func(this, () =>
            {
                this.ConnectServer()
            }), "重试")
            .Show()
    }

    protected OnNetMsg(ev: YK.ResponseMessageEvent)
    {
        if (ev.cmd == YK.NetMgrEventDef.onopen)
        {
            this.OnConnetServer()
        }
        else if (ev.cmd == YK.NetMgrEventDef.onerror
            || ev.cmd == YK.NetMgrEventDef.onclose)
        {
            this.OnConnetServerError(ev.data)
        }
        else
        {
            if (ev.Data.head.cmd == 200)
            {
                this.OnLogin(ev.Data)
            }
        }
    }

    protected OnHandler(ev: YK.EventData)
    {
        if (ev.cmd == YK.ModeMgr.EventType.SENDINITMSGOK)
        {
            this.OnInitMsged()
        }
    }
}