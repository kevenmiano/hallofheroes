import SceneType from "../map/scene/SceneType";

export class ClientStateType {
  constructor() {}
  public static CLIENT_INCASTLE: number = 0;
  public static CLIENT_ROOMLIST: number = 1;
  public static CLIENT_GAMEROOM: number = 2;
  public static CLIENT_WORLDMAP: number = 3;
  public static CLIENT_CAMPAIGN: number = 4;
  public static CLIENT_BATTLE: number = 5;
  public static CLIENT_PVP_ROOM: number = 6;

  public static getClientState(scene: SceneType): number {
    switch (scene) {
      case SceneType.BATTLE_SCENE:
        return ClientStateType.CLIENT_BATTLE;
      case SceneType.CAMPAIGN_MAP_SCENE:
        return ClientStateType.CLIENT_CAMPAIGN;
      case SceneType.CASTLE_SCENE:
        return ClientStateType.CLIENT_INCASTLE;
      case SceneType.OUTER_CITY_SCENE:
        return ClientStateType.CLIENT_WORLDMAP;
      case SceneType.PVE_ROOM_SCENE:
        return ClientStateType.CLIENT_GAMEROOM;
      case SceneType.PVP_ROOM_SCENE:
        return ClientStateType.CLIENT_PVP_ROOM;
    }
    return -1;
  }
}
