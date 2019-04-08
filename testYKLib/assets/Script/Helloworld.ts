import { RoleMode } from "./RoleMode";
import EmojiParser from "./EmojiParser";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    start () {
        // init logic
        this.label.string = this.text;
        // fgui.
        // YK.Net
        // SuperConfig.n
        YK.Log.Log("yk log wshow");
        // YK.TimeDelay
        // var one =  new RoleMode();
        var two = new EmojiParser();
        // var one = new YK.GameFlag();
    }
}
