// @ts-nocheck
import UIButton from "../../../../core/ui/UIButton";
import MainToolBar from "../MainToolBar";
import { EmMainToolBarBtnLocationType } from "./EmMainToolBarBtnLocationType";
import { MainToolBarButtonData } from "./MainToolBarButtonData";

/*
 * @Author: jeremy.xu
 * @Date: 2023-12-08 17:53:06
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-14 11:38:04
 * @Description: 
 */
export class MainToolBarBtnActionHandler {
    target: MainToolBar;
    play(anitime: number = 0.34) {
        let bFold = this.target.bFold
        let btnExtend = this.target.btnExtend
        let basePos = new Laya.Point(btnExtend.x, btnExtend.y)
        let showRow1Btns = this.target.getBtnListByLocaltionType(EmMainToolBarBtnLocationType.Row1)
        let showRow2Btns = this.target.getBtnListByLocaltionType(EmMainToolBarBtnLocationType.Row2)
        let showCowBtns = this.target.getBtnListByLocaltionType(EmMainToolBarBtnLocationType.Cow)

        let nodelay: boolean = anitime <= 0
        if (nodelay) {
            btnExtend.rotation = bFold ? 45 : 0
        } else {
            btnExtend.touchable = false;
            TweenMax.to(btnExtend, anitime, {
                rotation: bFold ? 45 : 0, ease: Quart.easeInOut, onComplete: () => {
                    btnExtend.touchable = true;
                }
            });
        }

        let srcAlpha = bFold ? 0 : 1;
        let dstAlpha = bFold ? 1 : 0;
        let tempPos: Laya.Point;
        for (let index = 0; index < showRow1Btns.length; index++) {
            let btn = showRow1Btns[index] as UIButton;
            let btnData = btn.view.data as MainToolBarButtonData;
            tempPos = basePos;
            if (bFold) {
                tempPos = this.target.model.getBtnPos(basePos, btnData.locationType, index)
            }
            if (nodelay) {
                btn.alpha = 1;
                btn.x = tempPos.x;
                btn.y = tempPos.y;
                btn.touchable = true;
            } else {
                btn.alpha = srcAlpha;
                btn.touchable = dstAlpha >= 1;
                TweenMax.to(btn, anitime, { x: tempPos.x, y: tempPos.y, alpha: dstAlpha, ease: Quart.easeInOut });
            }
        }
        for (let index = 0; index < showRow2Btns.length; index++) {
            let btn = showRow2Btns[index] as UIButton;
            let btnData = btn.view.data as MainToolBarButtonData;
            tempPos = this.target.model.getBtnPos(basePos, btnData.locationType, index)
            if (!bFold) {
                tempPos.y = tempPos.y + 100
            }
            if (nodelay) {
                btn.alpha = 1;
                btn.x = tempPos.x;
                btn.y = tempPos.y;
                btn.touchable = true;
            } else {
                btn.alpha = srcAlpha;
                btn.touchable = dstAlpha >= 1;
                TweenMax.to(btn, anitime, { x: tempPos.x, y: tempPos.y, alpha: dstAlpha, ease: Quart.easeInOut });
            }
        }
        for (let index = 0; index < showCowBtns.length; index++) {
            const btn = showCowBtns[index] as UIButton;
            let btnData = btn.view.data as MainToolBarButtonData;
            tempPos = basePos;
            if (bFold) {
                tempPos = this.target.model.getBtnPos(basePos, btnData.locationType, index)
            }
            if (nodelay) {
                btn.alpha = 1;
                btn.x = tempPos.x;
                btn.y = tempPos.y;
                btn.touchable = true;
            } else {
                btn.alpha = srcAlpha;
                btn.touchable = dstAlpha >= 1;
                TweenMax.to(btn, anitime, { x: tempPos.x, y: tempPos.y, alpha: dstAlpha, ease: Quart.easeInOut });
            }
        }

        this.target.bFold = !bFold;
    }
}