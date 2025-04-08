/*
 * @Author: jeremy.xu
 * @Date: 2021-05-26 17:49:49
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-07-22 21:20:46
 * @Description: 
 */

import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { ResourceData } from "../datas/resource/ResourceData";
import { ArmyManager } from "./ArmyManager";
import { PlayerManager } from "./PlayerManager";
import { ResourceManager } from "./ResourceManager";

export class DataCommonManager {
    static _instance: any;

    public setup() { }

    public static get Instance(): DataCommonManager {
        if (!DataCommonManager._instance) {
            DataCommonManager._instance = new DataCommonManager();
        }
        return DataCommonManager._instance;
    }

	public static get playerInfo(): PlayerInfo {
		return PlayerManager.Instance.currentPlayerModel.playerInfo;
	}

	public static get thane(): ThaneInfo {
		return ArmyManager.Instance.thane;
	}

    public static get gold(): ResourceData {
        return ResourceManager.Instance.gold;
    }
    
}