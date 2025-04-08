// @ts-nocheck
import GameEventDispatcher from "./GameEventDispatcher";

export class RemotePetEvent extends GameEventDispatcher {
    public static PET_CHANGE: string = "PET_CHANGE";
    public static FRIEND_LIST: string = "FRIEND_LIST";
    public static Turn_LIST: string = "Turn_LIST";
    public static COMMIT: string = "COMMIT";
    public static SKILLEVELUP: string = "SKILLEVELUP";
    public static ORDERDATA_LOAD_COMPLETE: string = "ORDERDATA_LOAD_COMPLETE";
    public static PAGE_UPDATE: string = "PAGE_UPDATE";
    public static UPDATEMOPUP: string = "UPDATEMOPUP";
    public static UPDATEORDER: string = "UPDATEORDER";
}