import { BaseUI, UIMgr } from "../../YK/core/UIMgr/UIMgr";
import { MessageBox } from "./MessageBox";
import { LoadingWind } from "./LoadingWind";
import { NetMgrEventDef, HttpRespData, NetMgr } from "../../YK/core/Net/NetMgr";
import { ModeMgr } from "../../YK/core/ModeMgr/ModeMgr";
import { RoleMode } from "../Modes/RoleMode";
import { Func, EventData } from "../../YK/core/EventMgr/DispatchEventNode";
import { ResponseDataInfo, ResponseMessageEvent } from "../../YK/core/Net/ResponseMessageEvent";
import { MainScene } from "../Scenes/MainScene";
import { SceneMgr } from "../../YK/core/SceneMgr/SceneMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export class LoginWind extends BaseUI
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
        UIMgr.Instance.HideWind(LoadingWind)
        this.eventMgr.addNetEvent(200);
        this.eventMgr.addNetEvent(NetMgrEventDef.onopen)
        this.eventMgr.addNetEvent(NetMgrEventDef.onerror)
        this.eventMgr.addModeEvent(ModeMgr.EventType.SENDINITMSGOK)
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
            UIMgr.Instance.ShowModalWait()
            ModeMgr.Instance.GetMode<RoleMode>(RoleMode).SendHttpLogin(this.mLabelAcc.text,
                this.mLabelPass.text,
                new Func(this, (res: HttpRespData) =>
                {

                    if (res != null)
                    {
                        if (res.errorcode == 0)
                        {
                            this.ConnectServer()
                        }
                        else
                        {
                            UIMgr.Instance.CloseModalWait()
                            MessageBox.Create(res.msg).Show()
                        }
                    }
                    else
                    {
                        UIMgr.Instance.CloseModalWait()
                        MessageBox.Create("登陆失败尝试重新登陆").Show()
                    }
                }))
        }
    }

    public ConnectServer()
    {
        NetMgr.Instance.connect()
    }

    public OnConnetServer()
    {
        ModeMgr.Instance.GetMode<RoleMode>(RoleMode).SendLogin()
    }

    public OnLogin(ev: ResponseDataInfo)
    {
        UIMgr.Instance.CloseModalWait()
        if (ev.head.errorcode == 0)
        {
            UIMgr.Instance.ShowModalWait()
            ModeMgr.Instance.SendInitMsg()
        }
        else
        {
            MessageBox.Create(ev.msg).Show()
        }
    }


    public OnInitMsged()
    {
        console.error("开始游戏")
        UIMgr.Instance.CloseModalWait()

        SceneMgr.Instance.GoToScene(MainScene)
    }

    public OnConnetServerError(error: string)
    {
        MessageBox.Create("链接服务器失败，尝试重连")
            .SetBtnConfirmCallBack(new Func(this, () =>
            {
                this.ConnectServer()
            }), "重试")
            .Show()
    }

    protected OnNetMsg(ev: ResponseMessageEvent)
    {
        if (ev.cmd == NetMgrEventDef.onopen)
        {
            this.OnConnetServer()
        }
        else if (ev.cmd == NetMgrEventDef.onerror
            || ev.cmd == NetMgrEventDef.onclose)
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

    protected OnHandler(ev: EventData)
    {
        if (ev.cmd == ModeMgr.EventType.SENDINITMSGOK)
        {
            this.OnInitMsged()
        }
    }
}