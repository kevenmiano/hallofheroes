// @ts-nocheck
export default class SceneType {
	static LOGIN_SCENE: string = 'LOGIN_SCENE';
	/**
	 *空白的, 强制切换时 过渡
	 */
	static EMPTY_SCENE: string = "EMPTY_SCENE";
	/**
	 * 新手场景
	 */
	static TRAINER_SCENE: string = 'TRAINER_SCENE';
	/**
	 * 城堡场景
	 */
	static CASTLE_SCENE: string = "CASTLE_SCENE";
	/**
	 * 天空之城场景
	 */
	static SPACE_SCENE: string = "SPACE_SCENE";
	/**
	 * 外城场景
	 */
	static OUTER_CITY_SCENE: string = "OUTER_CITY_SCENE";
	/**
	 * 战役地图场景
	 */
	static CAMPAIGN_MAP_SCENE: string = "CAMPAIGN_MAP_SCENE";
	/**
	 * 战斗场景
	 */
	static BATTLE_SCENE: string = "BATTLE_SCENE";
	/**
	 *房间 
	 */
	static PVE_ROOM_SCENE: string = "PVE_ROOM_SCENE";
	/**
	 *竞技场房间 
	 */
	static PVP_ROOM_SCENE: string = "PVP_ROOM_SCENE";
	/**
	 *农场 
	 */
	static FARM: string = "FARM";
	/**
	 * 武斗会房间
	 */
	static WARLORDS_ROOM: string = "WARLORDS_ROOM";
	/**
	 *  载具
	 * 
	 */
	static VEHICLE: string = "VEHICLE";
	/**
	 * 载具房间 
	 */
	static VEHICLE_ROOM_SCENE: string = "VEHICLE_ROOM_SCENE";

	/**
	 * 0 登录  LOGIN_SCENE
	 * 1 内城  CASTLE_SCENE
	 * 2 外城 OUTER_CITY_SCENE
	 * 3 副本地图 CAMPAIGN_MAP_SCENE
	 * 4 战斗 BATTLE_SCENE
	 * 5 PVE房间PVE_ROOM_SCENE
	 * 6 PVP房间PVP_ROOM_SCENE
	 * 7 农场
	 * 8 载具
	 * 9 众神之战
	 * 10 天空之城
	 * @param id
	 * 
	 */
	static getSceneTypeById(id: number): string {
		id = Number(id)
		switch (id) {
			case 0:
				return SceneType.LOGIN_SCENE;
				break;
			case 1:
				return SceneType.CASTLE_SCENE;
				break;
			case 2:
				return SceneType.OUTER_CITY_SCENE;
				break;
			case 3:
				return SceneType.CAMPAIGN_MAP_SCENE;
				break;
			case 4:
				return SceneType.BATTLE_SCENE;
				break;
			case 5:
				return SceneType.PVE_ROOM_SCENE;
				break;
			case 6:
				return SceneType.PVP_ROOM_SCENE;
				break;
			case 7:
				return SceneType.FARM;
				break;
			case 8:
				return SceneType.VEHICLE;
				break;
			case 9:
				return SceneType.WARLORDS_ROOM;
				break;
			case 10:
				return SceneType.SPACE_SCENE;
		}
		return SceneType.SPACE_SCENE;
	}
}
