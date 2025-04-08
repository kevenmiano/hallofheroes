import BaseWindow from '../../../core/ui/Base/BaseWindow';
import Resolution from '../../../core/comps/Resolution';
import LangManager from '../../../core/lang/LangManager';
/**
* @author:pzlricky
* @data: 2021-06-02 14:08
* @description 战力提升 
*/
export default class FightingUpdateWnd extends BaseWindow {

    public bg: fgui.GImage;
    public title: fgui.GTextField;
    public number: fgui.GTextField;
    public delta: fgui.GTextField;

    constructor() {
        super();
    }

    public OnInitWind() {
        this.contentPane.x = (Resolution.gameWidth - this.contentPane.width) / 2;
        this.contentPane.y = Resolution.gameHeight - 250;
        this.title.text = LangManager.Instance.GetTranslation("public.playerInfo.ap");
    }

    OnShowWind() {
        super.OnShowWind();
    }

    setNumberView(value: number, delta:number) {
        this.number.text = value.toString();
        if(delta == 0)
        {
            this.delta.text = "";
        }
        else if(delta > 0)
        {
            this.delta.text = "+" + delta;
        }
        else
        {
            this.delta.text = "-" + Math.abs(delta);
        }
    }


}