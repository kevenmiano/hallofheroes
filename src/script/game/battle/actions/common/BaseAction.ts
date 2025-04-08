/**
 * @author:jeremy.xu
 * @data: 2020-11-23 20:00
 * @description  action基类, 定义了action的生命周期行为 
 **/

import { InheritIActionType } from "../../../constant/BattleDefine";
import { IAction } from "../../../interfaces/IAction";
import { CallBacker } from "../../../utils/CallBacker";

export class BaseAction implements IAction {
    public inheritType: InheritIActionType = InheritIActionType.BaseAction

    finished: boolean;
    priority: number = 0;
    type: string = "";
    private _callBackFinish: CallBacker = new CallBacker(this);
    protected _paused: boolean;
    public synchronization() {
    }

    public replace(action: IAction): boolean {
        return false;
    }

    public prepare() {
    }
    public ready($liftTime: number = 0): boolean {
        return true;
    }

    public filter(action: IAction): boolean {
        return false;
    }

    public update() {
    }

    public cancel() {
        this.finished = true;
    }

    public dispose() {
        this._callBackFinish.dispatch();
    }
    public getCode(): number {
        return 0x00;
    }

    public get callBackFinish(): CallBacker {
        return this._callBackFinish;
    }

    public pause() {
        this._paused = true;
    }
    public resume() {
        this._paused = false;
    }

}