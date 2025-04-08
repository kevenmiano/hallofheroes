import GameEventDispatcher from '../../../core/event/GameEventDispatcher';
import Logger from '../../../core/logger/Logger';


export class PropertyData extends GameEventDispatcher {

    //玩家属性
    protected mapPropertyData: Map<string, Object> = new Map();
    /**
     * 属性赋值
     * @param {string} proName
     * @param {Object} proValue
     */
    public setPropertyData(proName: string, proValue: Object) {
        if (this.mapPropertyData.has(proName)) {
            this.mapPropertyData.set(proName, proValue);
        } else {
            this.mapPropertyData.set(proName, proValue);
        }
    }

    /**
     * 获取属性
     * @param {string} proName
     * @returns {Object}
     */
    public getPropertyData(proName: string): Object {
        if (this.mapPropertyData.has(proName)) {
            return this.mapPropertyData.get(proName);
        } else {
            Logger.error("proName is not find", proName);
            return null;
        }
    }

    public containProperty(proName: string): boolean {
        return this.mapPropertyData.has(proName);
    }

    public getAllPropertyData<T>(proName: string): T {
        let obj: any = this.getPropertyData(proName);
        let t = <T>obj;
        return t;
    }

    public clear() {
        this.mapPropertyData.clear();
    }
}

/**
 * 数据基类
 */
export default class BaseModel {

    //自身属性
    private m_propertyData: PropertyData = null;
    public m_mapPropertyManager: Map<string, any> = new Map();//(string ,propertyDataUpdateHandleEx);

    //构造函数
    constructor() {
        this.m_propertyData = new PropertyData();
    }

    public get propertyData(): PropertyData {
        if (this.m_propertyData == null) {
            this.m_propertyData = new PropertyData();
        }
        return this.m_propertyData;
    }

    public setPropertyData(proName: string, proValue: Object) {
        this.m_propertyData.setPropertyData(proName, proValue)
    }

    public getPropertyData(proName: string): Object {
        return this.getAnyPropertyData<Object>(proName);
    }

    public getAnyPropertyData<T>(proName: string): T {
        if(this.containProperty(proName)) {
            let obj = this.m_propertyData.getAllPropertyData<T>(proName);
            return obj;
        }
        return null;
    }

    public containProperty(proName: string): boolean {
        return this.m_propertyData.containProperty(proName);
    }

    /**
     * 注册属性 propertyDataUpdateHandle委托 ()
     * @param {string} proName
     * @param propertyDataUpdateHandle
     */
    public registerPropertyDataUpdateHandle(proName: string, propertyDataUpdateHandle: Function) {
        if (this.m_mapPropertyManager.has(proName)) {
            Logger.error("RegisterPropertyDataUpdateHandle Property " + proName + " has exist !!!");
        } else {
            this.m_mapPropertyManager.set(proName, propertyDataUpdateHandle);
        }
    }

    /**
     * 更新属性
     * @param {string} proName
     * @param {Object} oldValue
     * @param newValue
     * @param {Object[]} params
     */
    public onUpdatePropertyDataUpdateHandle(proName: string, oldValue: Object, newValue: Object, params?: Object[]) {
        if (this.m_mapPropertyManager.has(proName)) {
            Logger.log("onUpdateProperty   Property :" + proName, oldValue, "---", newValue);
            this.m_mapPropertyManager.get(proName)(oldValue, newValue, params);
        }
    }

    public clearProperty() {
        if(this.m_propertyData) {
            this.m_propertyData.clear();
        }
    }
}