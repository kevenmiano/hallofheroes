// @ts-nocheck
import { EmWindow } from '../../game/constant/UIDefine';
//ui分层
export enum EmLayer {
    STAGE_BOTTOM_LAYER = 0,
    /**
     * 游戏中底层
     */
    GAME_BOTTOM_LAYER,
    GAME_BASE_LAYER,
    GAME_UI_LAYER,
    /**
     * FGUI_LAYER
     */
    FGUI_LAYER,
    GAME_DYNAMIC_LAYER,
    /** 
     * 游戏动态层2</br>
     * 在动态层与菜单层中间。</br>
     * 显示动态层时,如果同时需要显示聊天框</br>
     * 可以把聊天放到该层显示.</br>
     * */
    GAME_DYNAMIC_LAYER2,
    GAME_MENU_LAYER,
    GAME_TOP_LAYER,

    STAGE_DYANMIC_LAYER,
    STAGE_TOP_LAYER,
    /**
     * 舞台拖拽层
     */
    STAGE_DRAG_LAYER,

    /**
     * 装备提示物品提示层
     */
    STAGE_TOOLTIP_LAYER,
    /**
    * 新手引导层
    */
    NOVICE_LAYER,
    /**
     * 新手上层动态层
     */
    STAGE_TIP_DYANMIC_LAYER,
    /**
     * 公用提示
     */
    STAGE_TIP_LAYER,

}

export default interface IView {

    bind(view: fgui.GComponent, args: any, viewCfg: any);

    exit();

    setVisible(f: boolean);

    setOrder(order: number);

    getUIType(): EmWindow;

    getNode(): any;

    isLoad(): boolean;

    getLayer(): any;

    setLayer(v: any);

    getUICfg(): any;

    showEffect();

    hideEffect();

    /**
     * 添加至舞台
     */
    onAddToStage();

    /**
     * 从舞台移除
     */
    onRemoveFromStage();

    resize();

}