declare namespace YK {
    class DispatchEventNode extends cc.Component {
        private eventDataPools;
        private createEventData;
        private returnEventData;
        private eventDic;
        /**
         * 添加一个消息监听器
         * @param type 消息类型
         * @param callBack 回调函数
         * @param target 作用对象
         * @param priority 消息的优先级
         * @param once 是否只监听一次
         */
        addEventListener(type: string | number, callBack: EventCallbackListener, target: any, priority?: number, once?: boolean): void;
        /**
         * 移除一个消息监听器
         * @param type 消息id
         * @param callBack 回调函数
         * @param target 作用的对象
         */
        removeEventListener(type: string | number, callBack: EventCallbackListener, target: any): void;
        /**
         * 是否存在这个监听消息
         * @param type 消息类型
         * @param callBack 回调类型
         * @param target 回调对象
         */
        hasEventListener(type: string | number, callBack: EventCallbackListener, target: any): boolean;
        /**
         * 派发消息
         * @param ev 派发的消息内容
         */
        DispatchEvent(ev: EventData): void;
        /**
         * 派发消息
         * @param type 消息id
         * @param data 消息内容
         */
        DispatchEventByType(type: string | number, data?: any): void;
        private _DispatchEvent;
    }
    type EventListenerInfoData = {
        callBack: EventCallbackListener;
        target: any;
        priority: number;
        once: boolean;
    };
    type EventListenerClassDic = {
        [key: string]: Array<EventListenerInfoData>;
    };
    type EventCallbackListener = ((ev: EventData) => void);
    class EventData extends cc.Event {
        constructor(cmd: string, obj: any);
        cmd: string;
        data: any;
        isSotp: boolean;
        /**
         * Stop
         */
        Stop(): void;
    }
    class Func {
        private mThisObj;
        private mCallBack;
        constructor(thisObj: any, callBack: Function);
        Invoke(...args: any[]): void;
    }
}
declare namespace YK {
    class EventListenerMgr {
        private mOwner;
        constructor(dis?: DispatchEventNode);
        private mListener;
        /**
         *
         * @param callback 回调
         * @param thisObj 作用对象
         * @param type 消息类型
         * @param _priority 优先级
         * @param _dispatchOnce 是否只派发一次
         */
        addListener(type: string | number, callback: EventCallbackListener, thisObj: any, _priority?: number, _dispatchOnce?: boolean): void;
        /**
         *
         * @param callback 回调
         * @param thisObj 作用对象
         * @param type 消息类型
         */
        removeListener(callback: EventCallbackListener, thisObj: any, type: string | number): void;
        removeAllListener(): void;
    }
    class InterchangeableEventListenerMgr {
        private networkEvnets;
        private sceneEvents;
        private uiEvents;
        private modeEvents;
        private otherEvents;
        private mDefCallback;
        private mDefObj;
        private mNetCallback;
        private mModeCallback;
        private mSceneCallback;
        private mUICallback;
        constructor(thisObj: any, defCallback?: EventCallbackListener);
        setDegCallback(callback: EventCallbackListener, priority?: number): this;
        setNetCallback(callback: EventCallbackListener, priority?: number): this;
        setModeCallback(callback: EventCallbackListener, priority?: number): this;
        setSceneCallback(callback: EventCallbackListener, priority?: number): this;
        setUICallback(callback: EventCallbackListener, priority?: number): this;
        addListener(dis: DispatchEventNode, type: string | number, callback?: EventCallbackListener, thisObj?: any, _priority?: number, _dispatchOnce?: boolean): void;
        removeListener(dis: DispatchEventNode, type: string | number, callback?: EventCallbackListener, thisObj?: any): void;
        addNetEvent(type: string | number, callback?: EventCallbackListener, thisObj?: any, _priority?: number, _dispatchOnce?: boolean): void;
        removeNetEvent(type: string | number, callback?: EventCallbackListener, thisObj?: any): void;
        addUIEvent(type: string | number, callback?: EventCallbackListener, thisObj?: any, _priority?: number, _dispatchOnce?: boolean): void;
        removeUIEvent(type: string | number, callback?: EventCallbackListener, thisObj?: any): void;
        addSceneEvent(type: string | number, callback?: EventCallbackListener, thisObj?: any, _priority?: number, _dispatchOnce?: boolean): void;
        removeSceneEvent(type: string | number, callback?: EventCallbackListener, thisObj?: any): void;
        addModeEvent(type: string | number, callback?: EventCallbackListener, thisObj?: any, _priority?: number, _dispatchOnce?: boolean): void;
        removeModeEvent(type: string | number, callback?: EventCallbackListener, thisObj?: any): void;
        RemoveAll(): void;
    }
    class EventListenerData {
        private static mEventListenerData;
        static CreateEventListenerData(dis: DispatchEventNode, callback: EventCallbackListener, thisObj: any, type: string, _priority?: number, _dispatchOnce?: boolean): EventListenerData;
        static ReturnEventListenerData(listener: EventListenerData): void;
        dis: DispatchEventNode;
        callback: EventCallbackListener;
        thisObj: any;
        type: string;
        priority: number;
        dispatchOnce: boolean;
        constructor(dis: DispatchEventNode, callback: EventCallbackListener, thisObj: any, type: string, _priority?: number, _dispatchOnce?: boolean);
        AttachListener(): boolean;
        DetachListener(): void;
    }
}
declare namespace YK {
    class ModeMgr extends DispatchEventNode {
        static EventType: {
            SENDINITMSGOK: string;
        };
        mModes: Map<any, IMode>;
        private static mInstance;
        private mIsLoginSendingFlag;
        static readonly Instance: ModeMgr;
        AddMode<T extends IMode>(type: {
            new (): T;
        }): T;
        GetMode<T extends IMode>(type: {
            new (): T;
        }): T;
        InitData(param?: any): void;
        SendInitMsg(): void;
        ClearData(): void;
        onDestroy(): void;
        update(dt: any): void;
    }
    abstract class IMode {
        eventMgr: InterchangeableEventListenerMgr;
        constructor();
        abstract OnInitData(param: any): void;
        OnSendInitMsg(): void;
        /**
        * 处理消息
        * @param ev 参数
        */
        protected OnHandler(ev: EventData): void;
        abstract OnClear(): void;
        OnDestroy(): void;
        initMsgRespOk: boolean;
    }
}
declare namespace YK {
    class NetMgr extends DispatchEventNode {
        httpUrl: string;
        private static mInstance;
        private mTimeout;
        private mHeartTimeout;
        private pbkill;
        static readonly Instance: NetMgr;
        ip: string;
        start(): void;
        onDestroy(): void;
        update(dt: any): void;
        init(callBack: any): void;
        private CheckSendTimeOut;
        AddProto(pbName: string, protoNames: Array<string>): void;
        private socket;
        connect(wsurl?: any): void;
        private lastActivityTime;
        private heartbeatIntervalTimeId;
        private checkHeartbeatTimeOutIntervalTimeId;
        private onopen;
        private mIsConnect;
        isConnect(): boolean;
        private disConnect;
        private onerror;
        private onclose;
        private onmessage;
        private mMsgId;
        private readonly Msgid;
        private mSendQueue;
        private sendHeartbeat;
        private checkHeartbeat;
        private msgTimeOut;
        SendGet(url: any, callback: Func): void;
        Send(id: number, data?: any): void;
        private distributeMsg;
    }
    class NetMgrEventDef {
        static disConnect: string;
        static onerror: string;
        static onclose: string;
        static onopen: string;
        static HeartbeatTimeOut: string;
    }
    type HttpRespData = {
        msg: string;
        errorcode: number;
        data: any;
    };
}
declare namespace YK {
    class PackBase {
        cmd: number;
        msgid: number;
        errorcode: number;
        contentBuff: ArrayBuffer;
    }
}
declare namespace YK {
    class ProtoMap {
        static protos: {
            1: {
                id: number;
                request: any;
                response: any;
            };
        };
        static classMap: {};
        static Add(key: any, type: any): void;
        static Pack(head: PackBase, data?: any): any;
        static UnPack(head: PackBase, buff?: ArrayBuffer): any;
        static UnPackHead(buffer: ArrayBuffer): PackBase;
        static PackByClasName(cname: string, data: any): any;
        static UnPackByClasName(cname: string, buff: any): any;
        static AddProto(proto: ProtoInfo): void;
    }
    type ProtoInfo = {
        id: number;
        request: string;
        response: string;
    };
}
declare namespace YK {
    class ResponseMessageEvent extends EventData {
        constructor(type: string);
        SetData(head: PackBase, msg: any): void;
        readonly Data: ResponseDataInfo;
    }
    type ResponseDataInfo = {
        head: PackBase;
        msg: any;
    };
}
declare namespace YK {
    class ResInfo {
        url: any;
        isKeepMemory: boolean;
        asset: any;
        isFGUIPack: boolean;
        readonly fullUrl: any;
    }
    class LoadGruopInfo {
        Progress: number;
        needLoad: Array<ResInfo>;
        add(url: string, isKeepMemory?: boolean, isFGUIPack?: boolean): this;
        onCompletion(callback: Function, thisObjs: any): this;
        onItemCompletion(callback: Function, thisObjs: any): this;
        start(): void;
        loadItem: Func;
        finish: Func;
    }
    class ResMgr extends DispatchEventNode {
        private mOldRes;
        private resDic;
        private static mInstance;
        static readonly Instance: ResMgr;
        GetRes(url: any): any;
        LoadGroup(loads: LoadGruopInfo): void;
        /**
         * 释放资源
         * @param forced 是否强制释放所有
         */
        pop(forced?: boolean): void;
        /**
         * 压入要释放的资源
         */
        push(): void;
    }
}
declare namespace YK {
    class SceneBase {
        protected firstWind: any;
        needLoadRes: LoadGruopInfo;
        eventMgr: InterchangeableEventListenerMgr;
        tasks: TaskMgr;
        constructor();
        private mParam;
        private mLoaded;
        private mTaskFinished;
        Enter(param: any): void;
        Leave(): void;
        Destroy(): void;
        /**
         * 任务完成
         * @param error 错误
         */
        protected TaskFinished(error: any): void;
        /**
         * 加载完成
         * @param error 加载错误
         */
        protected Loaded(error: any): void;
        private ChechEnter;
        /**
         * 加载完成
         */
        protected OnLoaded(): void;
        /**
         * 任务完成
         */
        protected OnTaskFinished(): void;
        /**
        * 处理消息
        * @param ev 参数
        */
        protected OnHandler(ev: EventData): void;
        /**
        * 场景初始化
        * @param param 参数
        */
        protected OnInit(param: any): void;
        /**
         * 进入场景
         */
        protected OnEnter(param: any): void;
        /**
         * 离开场景
         */
        protected OnLeave(): void;
        /**
         * 当场景被销毁的时候
         */
        protected OnDestroy(): void;
    }
}
declare namespace YK {
    class SceneMgr extends DispatchEventNode {
        private mScenes;
        private static mInstance;
        static readonly Instance: SceneMgr;
        private mCurScene;
        /**
         * 跳转场景
         * @param type 场景脚本文件
         * @param param 参数
         */
        GoToScene(script: any, param?: any): void;
    }
}
declare namespace YK {
    /**
     * 任务管理器
     */
    class TaskMgr {
        /**
         * 任务数
         */
        protected mTaskNum: number;
        /**
         * 一个任务被完成
         */
        protected mTaskItemFinished: Func;
        /**
         * 遇到错误是否停止
         */
        protected mFailureStop: boolean;
        /**
         * 任务全部完成
         */
        protected mFinished: Func;
        /**
         * 并行任务
         */
        protected mParallelTask: Array<ITask>;
        /**
         * 顺序任务
         */
        protected mSequence: Array<ITask>;
        /**
         * 是否在执行任务
         */
        protected mIsRuning: boolean;
        /**
        * 任务进度
        */
        progress: number;
        /**
         * 当前任务
         */
        currentTask: ITask;
        /**
         * 当前任务是否完成
         */
        isFinished: boolean;
        constructor(failureStop: boolean, finished: Func);
        /**
         * 添加一个任务
         * @param task 任务对象
         * @param isSequence 是否是需要时序
         * @return 任务id -1则为添加失败
         */
        AddTask(task: ITask, isSequence?: boolean): number;
        private Update;
        protected OnUpdate(): void;
        protected Finished(error?: any): void;
        /**
         *
         * @param id 任务id
         */
        HasTask(id: any): boolean;
        Stop(): void;
        Execute(): void;
    }
    /**
     * 任务接口
     */
    interface ITask {
        IsRuning: boolean;
        Id: number;
        IsDone: boolean;
        Error: string;
        TaskName: () => string;
        OnExecute: () => void;
        Reset: () => void;
    }
    /**
     * 任务基类
     */
    class TaskBase implements ITask {
        IsRuning: boolean;
        Id: number;
        IsDone: boolean;
        Error: string;
        TaskName(): string;
        OnExecute(): void;
        Reset(): void;
    }
}
declare namespace YK {
    class UIConfig {
        static modalLayerColor: cc.Color;
        static globalModalWaiting: any;
        static autoCloseWaitingTime: number;
    }
    class UIMgr extends DispatchEventNode {
        static UIStartScale: number;
        private mWinds;
        private modalWaitPane;
        private static mInstance;
        static readonly Instance: UIMgr;
        /**
             * 获取所有窗口
             */
        GetAllWinds(): Array<fgui.Window>;
        /**
         * 寻找窗口
         * @param type 类型
         */
        FindWind(type: any): fgui.Window;
        /**
         * 显示界面
         * @param type 界面类型
         * @param param 界面数据
         */
        ShowWind(type: any, param?: any): void;
        HideWind(type: any): void;
        HideWindowImmediatelyByType(type: any, dispose: boolean): void;
        HideWindowImmediately(wind: BaseUI, dispose: boolean): void;
        GetAllWind(isShow?: boolean, containDotDel?: boolean): Array<fgui.Window>;
        HideAllWind(dispose?: boolean, containDotDel?: boolean): void;
        /**
         * 显示窗口到最前面
         * @param wind 需要显示的窗口
         */
        BringToFront(wind: BaseUI): void;
        ShowModalWait(param?: any): void;
        CloseModalWait(): void;
        private mModeLayer;
        /**
         * 创建一个黑背景
         */
        private createModalLayer;
        private AdjustModalLayer;
    }
    abstract class BaseUI extends fgui.Window {
        eventMgr: InterchangeableEventListenerMgr;
        uiName: string;
        constructor();
        /**
         * 是否在顶层
         */
        readonly IsTop: boolean;
        readonly IsShowing: boolean;
        protected btnCloseNodeName: string;
        protected packName: string;
        protected resName: string;
        modal: boolean;
        dontDel: boolean;
        private mParam;
        UIObj: Map<string, fgui.GObject>;
        UICtrls: Map<string, fgui.Controller>;
        protected btnNameStartsWith: string;
        protected isNeedShowAnimation: boolean;
        protected isNeedHideAnimation: boolean;
        prefabUrl: string;
        protected clickBbackgroundClose: boolean;
        onInit(): void;
        FindAllChildren(root: cc.Node): Array<cc.Node>;
        Shown(param: any): void;
        Hide(): void;
        OnShown(Param: any): void;
        OnHide(): void;
        protected OnHandler(ev: EventData): void;
        protected DoShowAnimation(): void;
        protected DoHideAnimation(): void;
        protected OnBtnClick(ev: cc.Event.EventCustom): void;
        protected OnBtnClose(): void;
        protected abstract OninitWind(): any;
        protected abstract OnShowWind(): any;
        protected abstract OnHideWind(): any;
    }
}
declare namespace YK {
    class GameFlag {
        private mValue;
        Value: number;
        constructor(flag?: number);
        Add(flag: any): this;
        Remove(flag: any): this;
        Has(flag: any): boolean;
    }
}
declare namespace YK {
    class Log {
        static Log: (message?: any, ...optionalParams: any[]) => void;
        static Error: (message?: any, ...optionalParams: any[]) => void;
        static Warn: void;
    }
}
declare namespace YK {
    class TimeDelay extends cc.Component {
        /**
         * 当前事件执行的次数
         */
        repeat: number;
        private items;
        private toAdd;
        private toRemove;
        private pool;
        private static mInstance;
        static readonly Instance: TimeDelay;
        private GetFromPool;
        private ReturnToPool;
        Exists(callback: TimerCallback, thisObj: any): boolean;
        Add(interval: number, repeat: number, callback: TimerCallback, thisObj: any, callbackParam?: any): void;
        AddUpdate(callback: TimerCallback, thisObj: any, callbackParam?: any): void;
        Remove(callback: TimerCallback, thisObj: any): void;
        private lastTime;
        private deltaTime;
        start(): void;
        update(): void;
    }
    class TimeDelayData {
        repeat: number;
        interval: number;
        param: any;
        callback: TimerCallback;
        thisObj: any;
        deleted: boolean;
        elapsed: number;
        set(interval: number, repeat: number, callback: TimerCallback, thisObj: any, param: any): void;
    }
    type TimerCallback = (param: any) => void;
}
