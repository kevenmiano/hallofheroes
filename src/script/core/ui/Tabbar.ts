// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-19 21:29:55
 * @LastEditTime: 2024-02-23 15:42:43
 * @LastEditors: jeremy.xu
 * @Description: 分页组件
 */
import GTabIndex from "../../game/constant/GTabIndex";
import { SoundIds } from "../../game/constant/SoundIds";
import NewbieEvent from "../../game/constant/event/NotificationEvent";
import { NotificationManager } from "../../game/manager/NotificationManager";
import NewbieConfig from "../../game/module/guide/data/NewbieConfig";
import NewbieHandleUtils from "../../game/module/guide/utils/NewbieHandleUtils";
import AudioManager from "../audio/AudioManager";
import Logger from "../logger/Logger"

export default class Tabbar {
    private _curTabIndex: number = 0;                    // 当前界面索引
    private _curMainIndex: number = 0;                   // 当前主界面索引
    private _curSubIndex: number = 0;                    // 当前次界面索引
    private _selCallback: Function = null;               // 页面切换产生的回调
    public interruptCallback: Function = null;           // 外部设置打断切换的回调
    public soundRes: string = SoundIds.CONFIRM_SOUND;
    public mainTabClickLimit: number = 100;
    public subTabClickLimit: number = 100;
    public mainTabTimeCounter: number = 0;
    public subTabTimeCounter: number = 0;
    public openMainTabClickLimit: boolean = false;
    public openSubTabClickLimit: boolean = false;

    public get curTabIndex(): number {
        return this._curTabIndex
    }
    public get curMainIndex(): number {
        return this._curMainIndex
    }
    public get curSubIndex(): number {
        return this._curSubIndex
    }
    // 全局索引的后三位
    private _tag: string = "";
    public setTag(gIndex: number) {
        this._tag = gIndex.toString().substring(2)
    }
    // 主动点击的时候不需要切换背景, 由组件自行切换
    private _manualChangeBg: boolean = true;

    private _pagelist: Object = {};
    private _mainlist: fgui.GButton[];
    private _sublist_map: Map<number, fgui.GButton[]>;
    private getCurSubList(mainIndx: number): fgui.GButton[] {
        return this._sublist_map && this._sublist_map.get(mainIndx)
    }

    /**
     * 初始化Tabbar
     * @param page_list
     * @param main_list       
     * @param sub_list_map
     * @param sel_callback
     */
    init(page_list: Object, main_list: fgui.GButton[], sub_list_map: Map<number, fgui.GButton[]>, sel_callback: Function = null) {
        this._pagelist = page_list
        this._mainlist = main_list
        this._sublist_map = sub_list_map
        this._selCallback = sel_callback

        if (this._mainlist.length > 0) {
            this._mainlist.forEach((tabbar, index) => {
                tabbar.onClick(this, this.onMainTabClick, [index])
            });
        }
        if (this._sublist_map) {
            this._sublist_map.forEach((sub_list, index) => {
                sub_list.forEach((tabbar, index) => {
                    tabbar.onClick(this, this.onSubTabClick, [index])
                });
            });
        }
    }

    /**
     * 切换
     * @param index 
     * @param bConvert   是否把index(GTabIndex)转换为十位数
     * @param bSwitchSound
     */
    changeIndex(index: number, bConvert: boolean = false, bSwitchSound: boolean = true): boolean {
        if (bConvert || (index > 100)) {
            index = Math.floor(index / 1000)
        }

        if (index == this._curTabIndex) {
            return false
        }

        if (bSwitchSound) {
            AudioManager.Instance.playSound(this.soundRes)
        }

        let lastTabIndex = this._curTabIndex

        this._curTabIndex = index
        this._curMainIndex = Math.floor(index / 10)
        this._curSubIndex = index % 10

        if (this._manualChangeBg) {
            this.changeBg(this._curMainIndex, this._curSubIndex)
        }
        this._manualChangeBg = true;

        //Page界面显示
        let temp = {}
        for (const key in this._pagelist) {
            if (this._pagelist.hasOwnProperty(key)) {
                const pageNode = this._pagelist[key];
                if (pageNode && !temp[pageNode.name]) {
                    pageNode.visible = (Number(key) == index)
                    pageNode.avtive = (Number(key) == index)
                    // 处理多个tab使用一个界面的情况
                    if (pageNode.visible) {
                        temp[pageNode.name] = true
                    }
                }
            }
        }


        let curSubList = this.getCurSubList(this._curMainIndex)
        if (curSubList) {
            curSubList.forEach((element, idx) => {
                element.selected = ((idx + 1) == this._curSubIndex)
            });
        }

        if (this._selCallback) {
            this._selCallback(index, lastTabIndex)
        }
        
        NewbieHandleUtils.onHandleTabber(Number(index + this._tag))
        return true
    }

    public selectIndex(index) {
        this.onMainTabClick(index);
    }

    //主动点击触发
    private onMainTabClick(evt) {
        let index = evt
        let mainIndex = index + 1
        let tabIndex = mainIndex * 10
        //存在subTabbar默认选择subTabbar的第一个
        if (this.getCurSubList(mainIndex) && this._pagelist[tabIndex + 1]) {
            tabIndex = tabIndex + 1    // 1->11
        } else {
            // tabIndex = tabIndex      // 1->10
        }

        if (this.openMainTabClickLimit) {
            if (!this.checkMainTabCanClick()) {
                Logger.xjy("[Tabbar]main连点限制")

                if (this._curMainIndex != (mainIndex)) {
                    this.defaultTabState(index, true)
                }
                return
            }
            this.mainTabTimeCounter = Date.now()
        }

        if (this.interrupt(tabIndex, index, true)) {
            return
        }

        this._mainlist.forEach((element, idx) => {
            element.selected = (idx == index)
        });

        this._manualChangeBg = false
        this._curMainIndex = mainIndex
        this.changeIndex(tabIndex, false)
    }

    private onSubTabClick(evt) {
        let index = evt
        let tabIndex = this._curMainIndex * 10 + (index + 1)

        if (this.openSubTabClickLimit) {
            if (!this.checkSubTabCanClick()) {
                Logger.xjy("[Tabbar]sub连点限制")

                if (this._curSubIndex != (index + 1)) {
                    this.defaultTabState(index, false)
                }
                return
            }
            this.subTabTimeCounter = Date.now()
        }

        if (this.interrupt(tabIndex, index, false)) {
            return
        }

        this._manualChangeBg = false
        this._curSubIndex = index + 1
        this.changeIndex(tabIndex, false)
    }

    private interrupt(changeToTabIndex: number, elementIndex: number, bMainTab: boolean): boolean {
        let bBreak = this.interruptCallback && this.interruptCallback(changeToTabIndex);
        if (bBreak) {
            let list = bMainTab ? this._mainlist : this.getCurSubList(this._curMainIndex)
            list[elementIndex].selected = false
        }
        return bBreak
    }

    private defaultTabState(elementIndex: number, bMainTab: boolean) {
        let list = bMainTab ? this._mainlist : this.getCurSubList(this._curMainIndex)
        if (list) {
            list[elementIndex].selected = false
        }
    }

    //切换按钮背景图片
    private changeBg(mainIdx: number, subIdx: number) {
        this._mainlist.forEach((ele, idx) => {
            ele.selected = (mainIdx - 1) == idx
        });

        let curSubList = this.getCurSubList(this._curMainIndex)
        if (subIdx == 0 || !curSubList) {
            return
        }

        curSubList.forEach((ele, idx) => {
            ele.selected = (subIdx - 1) == idx
        });
    }

    private checkSubTabCanClick() {
        let nowTime = Date.now();
        let padingTime = nowTime - this.subTabTimeCounter
        if (padingTime < this.subTabClickLimit) {
            return false;
        }
        this.subTabTimeCounter = nowTime
        return true;
    }

    private checkMainTabCanClick() {
        let nowTime = Date.now();
        let padingTime = nowTime - this.mainTabTimeCounter
        if (padingTime < this.mainTabClickLimit) {
            return false;
        }
        this.mainTabTimeCounter = nowTime
        return true;
    }

    public removeEvent() {
        if (this._mainlist.length > 0) {
            this._mainlist.forEach((tabbar, index) => {
                tabbar.offClick(this, this.onMainTabClick)
            });
        }
        if (this._sublist_map) {
            this._sublist_map.forEach((sub_list, index) => {
                sub_list.forEach((tabbar, index) => {
                    tabbar.offClick(this, this.onSubTabClick)
                });
            });
        }
    }

    dispose() {
        this._curTabIndex = 0
        this._curMainIndex = 0
        this._curSubIndex = 0
        this._selCallback = null
        this.removeEvent();
        this._pagelist = {}
        this._mainlist = []
        this._sublist_map.clear()
    }
}