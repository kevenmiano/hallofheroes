import LayerMgr from "../../core/layer/LayerMgr";
import { EmLayer } from "../../core/ui/ViewInterface";

export class HintTips {



    public static createLabLLk(str: string, pos: Laya.Point) {
        let lab = new Laya.Label();
        lab.bold = true;
        lab.stroke = 3;
        lab.strokeColor = "#d25900";
        lab.fontSize = 30;
        lab.color = "#fff10e";
        lab.text = str;
        lab.pivotX = lab.width >> 1;
        lab.pivotY = lab.height >> 1;
        lab.x = pos.x;
        lab.y = pos.y;
        return lab;
    }

    public static showHintLabel(target: Laya.Sprite) {

        let targetY = target.y - 180;

        target.alpha = 1;


        Laya.Tween.to(target, { y: targetY }, 1200, Laya.Ease.linearIn, Laya.Handler.create(target, (para) => {
            target.visible = false;
            target.active = false;
            target.removeSelf();
        }), 0, false, true);


        Laya.Tween.to(target, { alpha: 0 }, 1000, Laya.Ease.linearIn, undefined, 200, false, true);
        let layer = LayerMgr.Instance.getLayer(EmLayer.GAME_TOP_LAYER);
        layer.pushView(target, 999);        

    }

}