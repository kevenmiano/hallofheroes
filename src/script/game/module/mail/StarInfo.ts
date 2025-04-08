// @ts-nocheck
import GameEventDispatcher from '../../../core/event/GameEventDispatcher';
import { SimpleDictionary } from '../../../core/utils/SimpleDictionary';
import { TempleteManager } from '../../manager/TempleteManager';
import { t_s_startemplateData } from '../../config/t_s_startemplate';
/**
* @author:pzlricky
* @data: 2021-04-13 16:05
* @description *** 
*/
export default class StarInfo extends GameEventDispatcher {

    protected static DROP_DELETE: string = "DROP_DELETE";
    protected _changeObj: SimpleDictionary;

    public id: number = 0;
    public userId: number = 0;
    public bagType: number = 0;
    public pos: number = 0;
    public grade: number = 0;
    public gp: number = 0;
    public template: t_s_startemplateData;
    public count: number = 1;
    public composeLock: boolean = false;

    private _tempId: number;
    constructor() {
        super();
        this._changeObj = new SimpleDictionary();
    }

    public set tempId(value: number) {
        if (this._tempId != value) {
            this._tempId = value;
            this.template = TempleteManager.Instance.getStarTemplateById(this._tempId);
        }
    }

    public get tempId(): number {
        return this._tempId;
    }
    public beginChange() {
        this._changeObj.clear();
    }

    public commit() {
        if (this._changeObj[StarInfo.DROP_DELETE]) {
        }
    }

    public copy(info: Object) {
        this.beginChange();
        for (let key in info) {
            if (Object.prototype.hasOwnProperty.call(info, key)) {
                let value = info[key];
                if (typeof this[key] == 'number') {
                    this[key] = Number(value);
                } else if (typeof this[key] == 'string') {
                    this[key] = value.toString();
                } else if (typeof this[key] == 'boolean') {
                    this[key] = value == 'true' ? true : false;
                } else {//结构体
                    this[key] = value.toString();
                }
            }
        }
        this.commit();
    }

}