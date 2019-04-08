// import { DispatchEventNode, EventData } from "../EventMgr/DispatchEventNode";
// import { EventListenerMgr, InterchangeableEventListenerMgr } from "../EventMgr/EventListenerMgr";
// import { ResMgr } from "../ResMgr/ResMgr";
// import { NetMgr } from "../Net/NetMgr";
// import { SceneMgr } from "../SceneMgr/SceneMgr";
// import { ModeMgr } from "../ModeMgr/ModeMgr";
namespace YK {
    const { ccclass, property } = cc._decorator;
    export class UIConfig {
        public static modalLayerColor = new cc.Color(0, 0, 0, 0.4 * 255)  //默认显示背景颜色
        public static globalModalWaiting: any = null    //等待界面
        public static autoCloseWaitingTime: number = 10 //自动关闭等待界面的时间
    }

    // @ccclass
    export class UIMgr extends DispatchEventNode {
        public static UIStartScale = 0.6
        private mWinds: Map<any, BaseUI> = new Map<any, BaseUI>()
        private modalWaitPane: BaseUI = null
        private static mInstance: UIMgr = null
        public static get Instance(): UIMgr {
            if (this.mInstance == null) {
                this.mInstance = cc.Canvas.instance.addComponent(UIMgr)
            }
            return this.mInstance
        }
        /**
             * 获取所有窗口
             */
        public GetAllWinds(): Array<fgui.Window> {
            let array: Array<fgui.Window> = new Array<fgui.Window>()

            for (var index = 0; index < fgui.GRoot.inst.numChildren; index++) {
                var element: fgui.GObject = fgui.GRoot.inst.getChildAt(index)
                if (element instanceof fgui.Window) {
                    array.push(element)
                }
            }
            return array
        }

        /**
         * 寻找窗口
         * @param type 类型
         */
        public FindWind(type: any) {
            let array = this.GetAllWinds()
            return array.find((value: fgui.Window, index: number,
                obj: Array<fgui.Window>) => {
                return value instanceof type
            })
        }


        /**
         * 显示界面
         * @param type 界面类型
         * @param param 界面数据
         */
        public ShowWind(type: any, param = null) {
            let wind = this.FindWind(type)
            if (wind == null) {
                wind = new type()
            }
            wind.data = param
            // wind.InitUI(param);
            fgui.GRoot.inst.showWindow(wind)


            // let wind: BaseUI = this.mWinds.get(type)
            // if (wind == null) {
            //     let node: cc.Node = new cc.Node()
            //     this.node.position = cc.Vec2.ZERO
            //     node.setContentSize(this.node.getContentSize())
            //     wind = node.addComponent(type)
            //     let name = wind.prefabUrl.substring(wind.prefabUrl.lastIndexOf("/") + 1)
            //     node.name = name
            //     node.addComponent(cc.Button)
            //     wind.Init(param)
            //     this.mWinds.set(type, wind)
            // }

            // if (!wind.IsShowing)
            //     this.node.addChild(wind.node)
            // else {
            //     if (!wind.IsTop)
            //         this.BringToFront(wind)
            // }
            // wind.Shown(param)
            // this.AdjustModalLayer()
        }

        public HideWind(type: any) {
            let wind = this.FindWind(type)
            if (wind != null) {
                fgui.GRoot.inst.hideWindow(wind)
            }
            // let wind: BaseUI = this.mWinds.get(type)
            // if (wind != null) {
            //     wind.Hide()
            // }
        }


        public HideWindowImmediatelyByType(type: any, dispose: boolean) {
            let wind: BaseUI = this.mWinds.get(type)
            if (wind != null) {
                this.HideWindowImmediately(wind, dispose)
            }

        }

        public HideWindowImmediately(wind: BaseUI, dispose: boolean) {
            if (wind != null) {
                if (wind.node.parent == this.node) {
                    this.node.removeChild(wind.node)
                }
                if (dispose && !wind.dontDel) {
                    wind.node.destroy()
                    let _key = null
                    this.mWinds.forEach(((value: BaseUI, key: any, map: Map<BaseUI, any>) => {
                        if (value == wind) {
                            _key = key
                        }
                    }));
                    if (_key != null)
                        this.mWinds.delete(_key)
                }
            }
            this.AdjustModalLayer()
        }


        public GetAllWind(isShow = false, containDotDel = true): Array<fgui.Window> {
            let keys = new Array<fgui.Window>()

            let array = this.GetAllWinds()

            array.forEach(((value: fgui.Window, key: any, map: Array<fgui.Window>) => {
                if (!isShow || value.isShowing) {
                    if (value instanceof BaseUI) {
                        let wind: BaseUI = value as BaseUI
                        if (!value.dontDel || containDotDel) {
                            keys.push(value)
                        }
                    }
                    else {
                        keys.push(value)
                    }
                }
            }));

            return keys

            // let keys: Array<any> = new Array<any>()

            // this.mWinds.forEach(((value: BaseUI, key: any, map: Map<BaseUI, any>) => {
            //     if (!value.dontDel || containDotDel) {
            //         if (isShow) {
            //             if (value.IsShowing) {
            //                 keys.push(key)
            //             }
            //         }
            //         else {
            //             keys.push(key)
            //         }
            //     }
            // }));

            // return keys
        }


        public HideAllWind(dispose = false, containDotDel = false) {
            let winds = this.GetAllWind(false, containDotDel)
            winds.forEach(element => {
                if (dispose)
                    element.dispose()
                else
                    fgui.GRoot.inst.hideWindowImmediately(element)
            });

            fgui.GRoot.inst.hidePopup()
            // // let winds = this.GetAllWind(false, containDotDel)
            // // winds.forEach(element => {
            // //     this.HideWindowImmediatelyByType(element, dispose)
            // // });
            // let winds = this.GetAllWind(false, containDotDel)
            // winds.forEach(element =>
            // {
            //     if (dispose)
            //         element.dispose()
            //     else
            //         fgui.GRoot.inst.hideWindowImmediately(element)
            // });

            // fgui.GRoot.inst.hidePopup()
        }

        /**
         * 显示窗口到最前面
         * @param wind 需要显示的窗口
         */
        public BringToFront(wind: BaseUI) {
            // let cnt = this.node.childrenCount;
            // let i = cnt - 1;
            // // if (this.mModeLayer.parent != null && !wind.modal)
            // // {
            // //     i = this.mModeLayer.getSiblingIndex() + 1
            // // }
            // for (; i >= 0; i--) {
            //     let g = this.node.children[i].getComponent(BaseUI)
            //     if (g != null) {
            //         if (g == wind) { return; }
            //         else break
            //     }
            // }
            // if (wind != null) {
            //     if (!wind.IsTop) {
            //         if (i >= 0)
            //             wind.node.setSiblingIndex(i)
            //     }
            // }
        }

        public ShowModalWait(param = null) {
            // if (UIConfig.globalModalWaiting != null) {
            //     this.ShowWind(UIConfig.globalModalWaiting, param)
            // }
            fgui.GRoot.inst.showModalWait(param)
            console.log("msg =" + param)
        }

        public CloseModalWait(): void {
            fgui.GRoot.inst.closeModalWait()
            // if (UIConfig.globalModalWaiting != null) {
            //     this.HideWind(UIConfig.globalModalWaiting)
            // }
        }


        private mModeLayer: cc.Node

        /**
         * 创建一个黑背景
         */
        private createModalLayer(): void {
            this.mModeLayer = new cc.Node("ModalLayer")
            let sp = this.mModeLayer.addComponent(cc.Sprite)

            let xx: cc.SpriteFrame = new cc.SpriteFrame("res/raw-internal/image/default_sprite_splash.png")
            sp.spriteFrame = xx
            sp.sizeMode = cc.Sprite.SizeMode.CUSTOM
            this.node.addChild(this.mModeLayer)
            let ww = this.mModeLayer.addComponent(cc.Widget)
            ww.isAlignBottom = true
            ww.isAlignTop = true
            ww.isAlignLeft = true
            ww.isAlignRight = true
            ww.bottom = 0
            ww.top = 0
            ww.left = 0
            ww.right = 0
            this.mModeLayer.color = cc.color(UIConfig.modalLayerColor.getR(), UIConfig.modalLayerColor.getG(), UIConfig.modalLayerColor.getB())
            this.mModeLayer.opacity = UIConfig.modalLayerColor.getA()
        }


        private AdjustModalLayer() {
            // if (this.mModeLayer == null) this.createModalLayer()

            // let cnt = this.node.childrenCount - 1;

            // for (var index = cnt; index >= 0; index--) {
            //     var element = this.node.children[index].getComponent(BaseUI)
            //     if (element != null && element.modal) {
            //         this.mModeLayer.active = false
            //         if (this.mModeLayer.parent == null) {
            //             this.node.insertChild(this.mModeLayer, index)
            //         }
            //         else {
            //             if (index > 0) {
            //                 if (element.IsTop)
            //                     this.mModeLayer.setSiblingIndex(index - 1)
            //                 else
            //                     this.mModeLayer.setSiblingIndex(index)
            //             }
            //             else
            //                 this.mModeLayer.setSiblingIndex(0)
            //         }
            //         this.mModeLayer.active = true
            //         return
            //     }
            // }
            // this.node.removeChild(this.mModeLayer)
        }

    }

    // export class BaseUI extends fgui.GComponent
    // {

    // }
    export abstract class BaseUI extends fgui.Window {
        public eventMgr: InterchangeableEventListenerMgr = null;
        public uiName = ""
        public constructor() {
            super()

        }
        /**
         * 是否在顶层
         */
        public get IsTop(): boolean {
            return this.node.parent != null && this.node.getSiblingIndex() == this.node.parent.childrenCount - 1
        }

        public get IsShowing(): boolean {
            return this.node.parent != null
        }

        protected btnCloseNodeName: string = "BtnClose"
        protected packName = ""
        protected resName = "Main"

        public modal: boolean = false
        public dontDel: boolean = false
        private mParam: any = null
        public UIObj: Map<string, fgui.GObject> = new Map<string, fgui.GObject>()
        public UICtrls: Map<string, fgui.Controller> = new Map<string, fgui.Controller>()
        protected btnNameStartsWith: string = "Btn"
        protected isNeedShowAnimation: boolean = false
        protected isNeedHideAnimation: boolean = false
        public prefabUrl = ""

        protected clickBbackgroundClose = false

        public onInit() {
            super.onInit()
            this.eventMgr = new InterchangeableEventListenerMgr(this, this.OnHandler)

            // this.mParam = param 
            //fairygui
            if (this.contentPane == null) {
                let windObj = fgui.UIPackage.createObject(this.packName, this.resName);
                windObj.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
                this.contentPane = windObj.asCom
            }
            this.center();
            this.UIObj.clear()
            this.UICtrls.clear()
            for (var index = 0; index < this.contentPane.numChildren; index++) {
                var element = this.contentPane.getChildAt(index);
                if (element.name.startsWith(this.btnNameStartsWith)) {
                    if (element.name == "BtnClose") {
                        // element.on("click", this.OnBtnClose, this)
                        element.onClick(this.OnBtnClose, this);
                    }
                    else {
                        // element.on("click", this.OnBtnClick, this)
                        element.onClick(this.OnBtnClick, this);
                    }
                }
                this.UIObj.set(element.name, element)
            }

            this.contentPane.controllers.forEach(element => {
                this.UICtrls.set(element.name, element)
            });

            this.setPivot(0.5, 0.5)
            this.OninitWind()

            // let prefab = ResMgr.Instance.GetRes(this.prefabUrl)
            // if (prefab != null) {
            //     this.contentPane = cc.instantiate(prefab)
            //     this.contentPane.active = false
            //     this.contentPane.parent = this.node
            //     this.contentPane.active = true
            //     this.contentPane.x = 0
            //     this.contentPane.y = 0
            //     this.contentPane.setContentSize(this.node.getContentSize())
            // }
            // else {
            //     console.error("实例化对象失败：url=" + this.prefabUrl)
            //     return
            // }
            // this.UIObj.clear()

            // let nodes = this.FindAllChildren(this.contentPane)
            // nodes.forEach(element => {
            //     if (element.name.startsWith(this.btnNameStartsWith)) {
            //         //let btn = element.getComponent(cc.Button)

            //         if (element.name == "BtnClose") {
            //             element.on("click", this.OnBtnClose, this)
            //         }
            //         else {
            //             element.on("click", this.OnBtnClick, this)
            //         }
            //     }
            //     this.UIObj.set(element.name, element)
            // });

            // if (this.clickBbackgroundClose && this.modal) {
            //     this.node.on("click", this.OnBtnClose, this)
            // }
            // this.OnInit(param)
        }

        public FindAllChildren(root: cc.Node): Array<cc.Node> {
            let list: Array<cc.Node> = new Array<cc.Node>()
            list.push(root)
            if (root.childrenCount <= 0) {
                return list
            }
            root.children.forEach(element => {
                let xx = this.FindAllChildren(element)
                xx.forEach(e => {
                    list.push(e)
                });
            });
            return list
        }

        public Shown(param) {
            this.mParam = param
            if (this.isNeedShowAnimation)
                this.DoShowAnimation()
            else
                this.OnShown(param)
        }

        public Hide() {
            if (this.isNeedHideAnimation)
                this.DoHideAnimation()
            else
                this.OnHide()
        }

        public OnShown(Param): void {

            this.OnShowWind()
        }

        public OnHide() {
            this.mParam = null
            this.data = null
            // UIMgr.Instance.HideWindowImmediately(this, false)
            this.eventMgr.RemoveAll()
            this.OnHideWind()
        }

        protected OnHandler(ev: EventData) {
        }

        protected DoShowAnimation() {
            if (this.isNeedHideAnimation) {
                this.scaleX = 0
                this.scaleY = 0
                fgui.GTween.to(this.scaleX, 1, 0.3)
                    .setEase(fgui.EaseType.BounceOut)
                    .onUpdate((v: fgui.GTweener) => {
                        this.setScale(v.value.x, v.value.x)
                    }, this)
                    .onComplete(() => {
                        super.doShowAnimation()
                    }, this)
            }
            else {
                super.doShowAnimation()
            }
            // this.OnShown(this.mParam)
        }

        protected DoHideAnimation() {
            // this.OnHide()
            if (this.isNeedHideAnimation) {
                this.setScale(UIMgr.UIStartScale, UIMgr.UIStartScale)
                fgui.GTween.to(this.scaleX, 0, 0.3)
                    .onUpdate((v: fgui.GTweener) => {
                        this.setScale(v.value.x, v.value.x)
                    }, this)
                    .onComplete(() => {
                        super.doHideAnimation()
                    }, this)
            }
            else {
                super.doHideAnimation()
            }
        }



        protected OnBtnClick(ev: cc.Event.EventCustom) {

        }

        protected OnBtnClose() {
            this.Hide()
        }

        protected abstract OninitWind()

        protected abstract OnShowWind()

        protected abstract OnHideWind()
    }

}