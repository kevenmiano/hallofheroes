// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2023-12-04 17:12:44
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-04 18:24:43
 * @Description: 
 */

import BaseTips from "./BaseTips";

export class CommonTips2Data {
    title: string
    content: string
    content2: string
    constructor(title?: string, content?: string, content2?: string) {
        this.title = title
        this.content = content
        this.content2 = content2
    }
}

export class CommonTips2 extends BaseTips {
    public img_bg: fgui.GImage;
    public txt_content_copy: fgui.GRichTextField;
    public txt_title: fgui.GRichTextField;
    public txt_content: fgui.GRichTextField;
    public txt_content2: fgui.GRichTextField;
    public imgLine: fgui.GImage;
    public totalBox: fgui.GGroup;
    private tipData: CommonTips2Data;

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();

        this.tipData = this.params[0] as CommonTips2Data;
        let showContent2 = Boolean(this.tipData.content2);
        this.imgLine.visible = showContent2;
        this.txt_content2.visible = showContent2;

        this.txt_title.text = this.tipData.title;
        this.txt_content_copy.text = this.tipData.content;
        if (this.txt_content_copy.width >= this.txt_content.maxWidth) {//超出最大宽度, 更改适配方式
            this.txt_content.autoSize = 2;
            this.txt_content.width = this.txt_content.maxWidth;
        } else {
            this.txt_content.autoSize = 1;
        }

        this.txt_content_copy.text = this.tipData.content2;
        if (this.txt_content_copy.width >= this.txt_content.maxWidth) {//超出最大宽度, 更改适配方式
            this.txt_content2.autoSize = 2;
            this.txt_content2.width = this.txt_content.maxWidth;
        } else {
            this.txt_content2.autoSize = 1;
        }
        this.txt_content.text = this.tipData.content;
        this.txt_content2.text = this.tipData.content2;
        this.totalBox.ensureBoundsCorrect();
    }

    protected onClickEvent() {
        this.onInitClick();
    }

    createModel() {
        super.createModel();
        this.modelMask.alpha = 0;
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    protected OnClickModal() {
        super.OnClickModal();
    }

    public OnHideWind() {
        super.OnHideWind();
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}