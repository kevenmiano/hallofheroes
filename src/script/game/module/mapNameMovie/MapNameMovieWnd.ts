/*
 * @Author: jeremy.xu
 * @Date: 2022-01-06 20:25:30
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-21 17:36:58
 * @Description: 
 */

import BaseWindow from '../../../core/ui/Base/BaseWindow';
import { GlobalConfig } from '../../constant/GlobalConfig';
import LangManager from '../../../core/lang/LangManager';


export default class MapNameMovieWnd extends BaseWindow {
    protected setScenterValue: boolean = true;
    private _backCall: Function;
    private _mapId: number = 0;
    private nameMc: fgui.Transition;
    private mapNameTxt: fgui.GTextField;
    private picGroup:fgui.GGroup;

    OnInitWind() {
        super.OnInitWind();
        this.picGroup.visible = false;
        this.nameMc = this.contentPane.getTransition("nameMc");
        if (this.params) {
            this._backCall = this.params.backCall
            this._mapId = GlobalConfig.Novice.OutCityMapID;
            this.mapNameTxt.text = LangManager.Instance.GetTranslation("mainBar.SmallMapBar.title");
            if (this.params.mapId) {
                this._mapId = this.params.mapId
            }
            if (this._mapId <= GlobalConfig.Novice.NewMapID) {
                if (this.params.mapName) {
                    this.mapNameTxt.text = this.params.mapName;
                }
            }
            this._backCall = this.params.backCall;
        }
    }

    OnShowWind() {
        super.OnShowWind();
        this.picGroup.visible = true;
        this.nameMc.play(new Laya.Handler(this, () => {
            if (this.destroyed) return;
            this.hide();
        }));
    }

    /**关闭 */
    OnHideWind() {
        super.OnHideWind();
        this._backCall && this._backCall();
    }
}