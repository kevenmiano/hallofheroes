import MediatorIds from "../datas/userinfo/MediatorIds";
import IMediator from "../interfaces/IMediator";

export default class MediatorMananger {
	private static _instance: MediatorMananger
	private _allMediators: Map<string, any[]>;
	public get allMediators(): Map<string, any[]> {
		return this._allMediators
	}

	public static get Instance(): MediatorMananger {
		if (!MediatorMananger._instance) MediatorMananger._instance = new MediatorMananger();
		return MediatorMananger._instance;
	}
	constructor() {
		this._allMediators = new Map();
	}

	public registerMediatorList(arr: any[], target: any, NAME: string): string {
		for (let i: number = 0; i < arr.length; i++) {
			arr[i] = new arr[i]();
			(arr[i] as IMediator).register(target);
		}
		let key: string = NAME + MediatorIds.id;
		this._allMediators[key] = arr;
		return key;
	}

	public addRegisterMediator(cls: any, target: any, key: string) {
		this.removeRegisterMediator(cls, target, key);
		let mediator: IMediator = <IMediator>new cls();
		mediator.register(target);
		let arr: any[] = this._allMediators[key];
		if (!arr) arr = [];
		arr.push(mediator);
		this._allMediators[key] = arr;
	}

	public removeRegisterMediator(cls: any, target: Object, key: string) {
		let arr: any[] = this._allMediators[key];
		if (!arr) return;
		for (var i: number = 0; i < arr.length; i++) {
			var temp: IMediator = arr[i] as IMediator;
			if (temp instanceof cls) {
				temp.unregister(target);
				arr.splice(i, 1);
				break;
			}
		}
	}

	public unregisterMediatorList(key: string, target: Object) {
		var arr: any[] = this._allMediators[key];
		if (!arr) return;
		for (var i: number = 0; i < arr.length; i++) {
			(arr[i] as IMediator).unregister(target);
		}
		delete this._allMediators[key];
	}
}