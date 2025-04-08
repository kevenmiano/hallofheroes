// @ts-nocheck
import ResMgr from "../../core/res/ResMgr";

export class AgentFilterManager {
	private static _Instance: AgentFilterManager;
	private static _hasSetup: boolean = false;

	private _agentFilter: string[];

	constructor() {
		this._agentFilter = [];
	}

	public static get hasSetup(): boolean {
		return AgentFilterManager._hasSetup;
	}

	public async setup(dataPath: string) {
		if (dataPath) {
			await ResMgr.Instance.loadRes(dataPath, (ret) => {
				if (ret) {
					var arr: string[] = (<string>ret).toLocaleLowerCase().split("\n");
					this._agentFilter = arr[0].split("|");
					AgentFilterManager._hasSetup = true;
				}
			}, null, Laya.Loader.TEXT)
		}
	}

	public static get Instance(): AgentFilterManager {
		if (!AgentFilterManager._Instance)
			AgentFilterManager._Instance = new AgentFilterManager;
		return AgentFilterManager._Instance;
	}

	public get agentFilter(): any[] {
		return this._agentFilter;
	}
}