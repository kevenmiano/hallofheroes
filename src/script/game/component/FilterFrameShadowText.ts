// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-18 10:11:34
 * @LastEditTime: 2023-05-19 15:22:32
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import { FilterFrameText, eFilterFrameText } from "./FilterFrameText"

export class FilterFrameShadowText extends Laya.Sprite {
    private txtContent: FilterFrameText
    private txtShadow: FilterFrameText
    public font: string
    public color: string
    public align: string
    public valign: string
    public _fontSize: number

    constructor(w: number, h: number, font = Laya.Text.defaultFont, fontSize: number = 18, color = "#ffffff", align: string = "center", valign = "middle", anchorX = 0.5, anchorY = 0.5, defStroke: boolean = false, defGlow: boolean = false) {
        super()

        this.width = w
        this.height = h
        this.font = font;
        this.color = color
        this.align = align
        this.valign = valign
        this._fontSize = fontSize
        let privotX = w * anchorX
        let privotY = h * anchorY
        this.pivot(privotX, privotY)

        this.txtShadow = new FilterFrameText(w, h, font, fontSize, "#000000", align, valign, anchorX, anchorY, defStroke, defGlow)
        this.txtContent = new FilterFrameText(w, h, font, fontSize, color, align, valign, anchorX, anchorY, defStroke, defGlow)
        this.addChild(this.txtShadow)
        this.addChild(this.txtContent)
        this.txtShadow.pos(this.pivotX, this.pivotY)
        this.txtContent.pos(this.pivotX, this.pivotY)

        this.setShadowOffset()

        if (defStroke) {
            this.setStroke()
        }
        if (defGlow) {
            // this.setGlowFilter()
        }
        return this
    }

    public set bold(b: boolean) {
        this.txtContent.bold = b
        this.txtShadow.bold = b
    }

    private _shadow: boolean = false;
    public set shadow(v: boolean) {
        this._shadow = v
        this.txtShadow.visible = v
    }
    public get shadow(): boolean {
        return this._shadow
    }

    public set shadowAlpha(v: number) {
        if (this._shadow) {
            this.txtShadow.alpha = v
        }
    }

    public set text(str: string) {
        this.txtContent.text = str
        this.txtShadow.text = str
    }

    public get text(): string {
        return this.txtContent.text
    }

    public get textHeight() {
        return this.txtContent.textHeight
    }

    public get textWidth() {
        return this.txtContent.textWidth
    }
    public set fontSize(v:number) {
        this._fontSize = v
        this.txtShadow.fontSize = v
        this.txtContent.fontSize = v
    }

    public get fontSize():number {
        return this._fontSize
    }

    setStroke(colorIdx: number = 0, width: number = 2) {
        this.txtContent.strokeColor = FilterFrameText.baseStrokeColor[colorIdx]
        this.txtContent.stroke = width
    }

    setShadowStroke(colorIdx: number = 0, width: number = 2) {
        if (!this._shadow) { return }
        this.txtShadow.strokeColor = FilterFrameText.baseStrokeColor[colorIdx]
        this.txtShadow.stroke = width
    }

    setPivot(x: number, y: number) {
        this.txtContent.pivot(x, y)
        this.txtShadow.pivot(x, y)
    }

    setGlowFilter(filter: Laya.Filter = new Laya.GlowFilter("#000000", 3.5, 0, 0)) {
        this.filters = [filter]
    }

    /**
     * @param index
     * @param type
     */
    setFrame(index: number, type = eFilterFrameText.Normal) {
        index = index - 1
        if (!FilterFrameText.Colors[type]) return
        if (!FilterFrameText.Colors[type][index]) return

        this.txtContent.color = FilterFrameText.Colors[type][index]
    }

    setShadowFrame(index: number, type = eFilterFrameText.Normal) {
        index = index - 1
        if (!FilterFrameText.Colors[type]) return
        if (!FilterFrameText.Colors[type][index]) return

        this.txtShadow.color = FilterFrameText.Colors[type][index]
    }

    setShadowOffset(x: number = 0.8, y: number = 0.8) {
        this.txtShadow.pos(this.pivotX + x, this.pivotY + y)
    }

    private _data: any
    public set data(value: any) {
        this._data = value;
    }

    public get data(): any {
        return this._data;
    }

    dispose() {
        super.destroy(true);
    }

}