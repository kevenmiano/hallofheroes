// @ts-nocheck
import { EmModel } from '../constant/model/modelDefine';
import BaseModel from '../mvc/model/BaseModel';
import { UserModel } from '../module/login/model/UserModel';
/**
* @author:pzlricky
* @data: 2020-11-20 09:40
* @description *** 
*/
export default class ModelMgr {

    private _models: Map<EmModel, BaseModel> = new Map();

    private static ins: ModelMgr;

    static get Instance(): ModelMgr {
        if (!ModelMgr.ins) {
            ModelMgr.ins = new ModelMgr();
        }
        return ModelMgr.ins;
    }

    preSetup(t?: any){
        this._models = new Map();
        this.register(EmModel.USER_MODEL, new UserModel());
    }

    setup() {
        
    }

    /**
     * 注册数据模型
     * @param type 模型类型  emModel
     * @param model 模型实例
     */
    register(type: EmModel, model: BaseModel) {
        if (this._models.has(type)) {
            return;
        }
        this._models.set(type, model);
    }

    /**
     * 删除数据模型
     * @param type 模型类型
     */
    remove(type: EmModel) {
        if (!this._models.has(type)) {
            return;
        }
        this._models.delete(type);
    }

    getModel(type: EmModel): BaseModel {
        return this._models.get(type)
    }

    hasModel(type: EmModel): boolean {
        return this._models.has(type);
    }

    /**注册属性更新接口 */
    registerUpdateHandler(type: EmModel, attribute: string, Handler: Function) {
        if (this.hasModel(type)) {
            let model = this.getModel(type);
            model.registerPropertyDataUpdateHandle(attribute, Handler);
        }
    }

    /**更新属性 */
    setProperty(type: EmModel, attribute: string, newvalue: any) {
        if (this.hasModel(type)) {
            let model = this.getModel(type);
            let oldValue = null;
            if (model.containProperty(attribute)) {
                oldValue = model.getPropertyData(attribute);
            }
            model.setPropertyData(attribute, newvalue);
            model.onUpdatePropertyDataUpdateHandle(attribute, oldValue, newvalue);
        }
    }

    /**
     * 获取数据模型属性值
     * @param type 数据模型类型
     * @param attribute 模型数据枚举定义属性
     */
    getProperty(type: EmModel, attribute: string): any {
        if (this.hasModel(type)) {
            let model = this.getModel(type);
            return model.getPropertyData(attribute);
        }
    }

    clear(type: EmModel) {
        if (this.hasModel(type)) {
            let model = this.getModel(type);
            model.clearProperty();
        }
    }

}