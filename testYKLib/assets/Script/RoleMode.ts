// import { IMode } from "../../YK/core/ModeMgr/ModeMgr";
// import { ResponseMessageEvent } from "../../YK/core/Net/ResponseMessageEvent";
// import { Func } from "../../YK/core/EventMgr/DispatchEventNode";
// import { NetMgr, HttpRespData } from "../../YK/core/Net/NetMgr";

const { ccclass, property } = cc._decorator;

// @ccclass
export class RoleMode //extends YK.IMode
{
    constructor(){
        // super();
        YK.Log.Log("stasrt after  new");
    }
    public accountInfo = { userid: 0, token: "" }

    public OnInitData(param: any): void
    {
        // this.eventMgr.setNetCallback(this.OnNetEvenet, 99)
        // this.eventMgr.addNetEvent(200);
    }
    public OnClear(): void
    {
    }

    public OnDestroy(): void
    {
        // super.OnDestroy()
    }

    public OnNetEvenet(ev: YK.ResponseMessageEvent)
    {
     

    }

    public SendHttpLogin(account: string, pwd: string, callBack:YK. Func)
    {
        YK.NetMgr.Instance.SendGet("modeName=account&api=login&account=" + account + "&pwd=" + pwd, new YK.Func(this, (res: YK.HttpRespData) =>
        {
            if (res != null && res.errorcode == 0)
            {
                this.accountInfo.token = res.data.token
                this.accountInfo.userid = res.data.userid
            }
            if (callBack != null)
            {
                callBack.Invoke(res)
            }
        }));
    }

    /**
     * 发送登陆
     * @param userid 用户id
     * @param token 账号token
     */
    public SendLogin(): void
    {
  
    }


}