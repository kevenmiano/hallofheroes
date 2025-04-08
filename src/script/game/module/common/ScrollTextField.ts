// @ts-nocheck
/**
* @author:pzlricky
* @data: 2021-03-23 14:11
* @description *** 
*/
export default class ScrollTextField {

    private content: fgui.GRichTextField;

    constructor(com: fgui.GComponent) {
        this.content = com.getChild('content').asRichTextField;
    }

    public set text(value: string) {
        this.content.text = value;
    }

    public set color(textColor: string) {
        this.content.color = textColor;
    }

    public set size(value: number) {
        this.content.fontSize = value;
    }

}