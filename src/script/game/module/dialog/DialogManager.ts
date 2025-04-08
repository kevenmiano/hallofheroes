
import { DialogControl } from "./DialogControl";
import { DialogModel } from "./DialogModel";

/**
* @author:pzlricky
* @data: 2021-06-01 10:50
* @description 剧情对话管理器
*/
export default class DialogManager {

    private static _dialogList: Array<DialogControl> = [];

    /**展示对话框 */
    public static showDialog(callback: Function, id: string) {
        var model: DialogModel = new DialogModel();
        var controller: DialogControl = new DialogControl(callback);
        controller.id = id;
        this._dialogList.push(controller);
        model.setXmlResources(id);
        controller.model = model;
    }

    /**隐藏对话框 */
    public static hideDialog(id: string) {
        let idx: number = 0;
        for (let index = 0; index < this._dialogList.length; index++) {
            let element = this._dialogList[index];
            if (element.id == id) {
                idx = index;
                break;
            }
        }
        if (idx >= 0) {
            this._dialogList.splice(idx, 1);
        }
    }

    public static get isExistDialog(): boolean {
        return (this._dialogList && this._dialogList.length > 0);
    }

}