import Dictionary from "../../../core/utils/Dictionary";
import { JobType } from "../../constant/JobType";
import { AvatarActions } from "./AvatarActions";
import { AvatarActionType } from "./AvatarActionType";
import { AvatarDirections } from "./AvatarDirections";
import { AvatarPartInfo } from "./AvatarPartInfo";
import { AvatarPosition } from "./AvatarPosition";

/** 值越大越先渲染 */
export class AvatarStaticData {
    private static _instance: AvatarStaticData;
    public static get Instance(): AvatarStaticData {
        if (!AvatarStaticData._instance)
            AvatarStaticData._instance = new AvatarStaticData();
        return AvatarStaticData._instance
    }
    public dic: Dictionary = new Dictionary();

    public static BASE_WEIGHT: number = 100;

    public static BASE_NPC_WALK: any[] = [0, 0, 0, 0, 0];
    public static BASE_NPC_STAND: any[] = [0, 0, 0];

    //18点-12点逆时针方向
    //行走
    private static BODY_WALK: any[] = [10, 20, 40, 40, 40];
    private static ARMY_WALK: any[] = [20, 10, 0, 0, 0];
    private static HAIR_UP_WALK: any[] = [0, 0, 10, 10, 10];
    private static HAIR_DOWN_WALK: any[] = [30, 30, 20, 20, 20];
    private static CLOAK_WALK: any[] = [40, 40, 30, 30, 30];
    private static WING_WALK: any[] = [40, 40, 30, 30, 30];
    private static PET_WALK: any[] = [-10, -10, -10, -10, -10];

    //男战士行走
    private static WARRIOR_MAN_HAIR_UP_WALK: any[] = [0, 0, 10, 32, 10];
    private static WARRIOR_MAN_HAIR_DOWN_WALK: any[] = [30, 30, 20, 35, 20];
    private static WARRIOR_MAN_WING_WALK: any[] = [40, 40, 30, 30, 30];

    //站立
    private static BODY_STAND: any[] = [10, 30, 50];
    private static ARMY_STAND: any[] = [20, 0, 0];
    private static HAIR_UP_STAND: any[] = [0, 10, 20];
    private static HAIR_DOWN_STAND: any[] = [30, 20, 30];
    private static CLOAK_STAND: any[] = [40, 40, 40];
    private static WING_STAND: any[] = [40, 40, 10];
    private static PET_STAND: any[] = [-10, -10, -10];

    private static BODY_WALK_MOUNT: any[] = [5, 15, 40, 40, 40];
    private static ARMY_WALK_MOUNT: any[] = [20, 10, 0, 0, 0];
    private static HAIR_UP_WALK_MOUNT: any[] = [0, 0, 10, 10, 10];
    private static HAIR_DOWN_WALK_MOUNT: any[] = [30, 30, 20, 20, 20];
    private static CLOAK_WALK_MOUNT: any[] = [40, 40, 30, 30, 30];
    private static MOUNT_WALK_MOUNT: any[] = [50, 50, 50, 50, 50];  ///坐骑行走
    private static WING_WALK_MOUNT: any[] = [10, 20, 30, 30, 30];
    private static PET_WALK_MOUNT: any[] = [-10, -10, -10, -10, -10];
    private static MOUNT_WING_WALK_MOUNT: any[] = [45, -5, -5, -5, 45];	//坐骑翅膀(走动)


    // 乘坐站立坐骑 站立时武器会遮挡身体
    private static BODY_STAND_MOUNT_STANDPOS: any[] = [10, 25, 50];
    private static ARMY_STAND_MOUNT_STANDPOS: any[] = [20, 0, 10];

    private static BODY_STAND_MOUNT: any[] = [20, 25, 50];
    private static ARMY_STAND_MOUNT: any[] = [10, 0, 10];
    private static HAIR_UP_STAND_MOUNT: any[] = [0, 10, 20];
    private static HAIR_DOWN_STAND_MOUNT: any[] = [30, 20, 30];
    private static CLOAK_STAND_MOUNT: any[] = [40, 40, 40];
    private static MOUNT_STAND_MOUNT: any[] = [50, 50, 60];  //坐骑站立
    private static WING_STAND_MOUNT: any[] = [40, 30, 0];
    private static PET_STAND_MOUNT: any[] = [-10, -10, -10];
    private static MOUNT_WING_STAND_MOUNT: any[] = [-5, -5, -5];	//坐骑翅膀(空闲)


    constructor() {
        //stand
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.HAIR_UP] = 1;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.BODY] = 2;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.ARMS] = 3;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.HAIR_DOWN] = 4;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.CLOAK] = 5;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.WING] = 6;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.MOUNT] = 7;

        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.ARMS] = 1;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.HAIR_UP] = 2;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.HAIR_DOWN] = 3;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.BODY] = 4;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.CLOAK] = 5;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.WING] = 6;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.MOUNT] = 7;

        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.ARMS] = 1;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.WING] = 2;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.HAIR_UP] = 3;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.HAIR_DOWN] = 4;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.CLOAK] = 5;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.BODY] = 6;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.MOUNT] = 7;

        //mount stand
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.HAIR_UP_MOUNT] = 1;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.ARMS_MOUNT] = 2;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.BODY_MOUNT] = 3;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.HAIR_DOWN_MOUNT] = 4;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.CLOAK_MOUNT] = 5;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.WING_MOUNT] = 7;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.MOUNT] = 6;

        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.ARMS_MOUNT] = 1;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.HAIR_UP_MOUNT] = 2;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.HAIR_DOWN_MOUNT] = 3;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.BODY_MOUNT] = 4;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.CLOAK_MOUNT] = 5;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.WING_MOUNT] = 6;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.MOUNT_MOUNT] = 7;

        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.WING_MOUNT] = 1;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.ARMS_MOUNT] = 2;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.HAIR_UP_MOUNT] = 3;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.HAIR_DOWN_MOUNT] = 4;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.CLOAK_MOUNT] = 5;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.BODY_MOUNT] = 6;
        this.dic[AvatarActions.ACTION_STOP + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.MOUNT] = 7;

        //walk
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.HAIR_UP] = 1;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.BODY] = 2;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.ARMS] = 3;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.HAIR_DOWN] = 4;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.CLOAK] = 5;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.WING] = 6;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.MOUNT] = 7;

        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.HAIR_UP] = 1;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.ARMS] = 2;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.BODY] = 3;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.HAIR_DOWN] = 4;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.CLOAK] = 5;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.WING] = 6;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.MOUNT] = 7;

        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.ARMS] = 1;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.HAIR_UP] = 2;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.HAIR_DOWN] = 3;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.WING] = 4;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.CLOAK] = 5;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.BODY] = 6;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.MOUNT] = 7;

        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_UP + "_" + AvatarPartInfo.ARMS] = 1;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_UP + "_" + AvatarPartInfo.HAIR_UP] = 2;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_UP + "_" + AvatarPartInfo.HAIR_DOWN] = 3;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_UP + "_" + AvatarPartInfo.CLOAK] = 4;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_UP + "_" + AvatarPartInfo.WING] = 5;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_UP + "_" + AvatarPartInfo.BODY] = 6;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_UP + "_" + AvatarPartInfo.MOUNT] = 7;

        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_UP + "_" + AvatarPartInfo.ARMS] = 1;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_UP + "_" + AvatarPartInfo.HAIR_UP] = 2;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_UP + "_" + AvatarPartInfo.HAIR_DOWN] = 3;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_UP + "_" + AvatarPartInfo.CLOAK] = 4;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_UP + "_" + AvatarPartInfo.WING] = 5;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_UP + "_" + AvatarPartInfo.BODY] = 6;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_UP + "_" + AvatarPartInfo.MOUNT] = 7;

        //mount walk
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.HAIR_UP] = 1;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.BODY] = 2;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.ARMS] = 3;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.HAIR_DOWN] = 4;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.CLOAK] = 5;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.MOUNT] = 6;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_DOWN + "_" + AvatarPartInfo.WING] = 7;

        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.HAIR_UP] = 1;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.ARMS] = 2;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.BODY] = 3;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.HAIR_DOWN] = 4;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.CLOAK] = 5;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.MOUNT] = 6;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_DOWN + "_" + AvatarPartInfo.WING] = 7;

        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.ARMS] = 1;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.HAIR_UP] = 2;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.HAIR_DOWN] = 3;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.WING] = 4;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.CLOAK] = 5;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.MOUNT] = 6;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT + "_" + AvatarPartInfo.BODY] = 7;

        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_UP + "_" + AvatarPartInfo.ARMS] = 1;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_UP + "_" + AvatarPartInfo.HAIR_UP] = 2;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_UP + "_" + AvatarPartInfo.HAIR_DOWN] = 3;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_UP + "_" + AvatarPartInfo.CLOAK] = 4;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_UP + "_" + AvatarPartInfo.WING] = 5;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_UP + "_" + AvatarPartInfo.BODY] = 6;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_RIGHT_UP + "_" + AvatarPartInfo.MOUNT] = 7;

        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_UP + "_" + AvatarPartInfo.ARMS] = 1;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_UP + "_" + AvatarPartInfo.HAIR_UP] = 2;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_UP + "_" + AvatarPartInfo.HAIR_DOWN] = 3;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_UP + "_" + AvatarPartInfo.CLOAK] = 4;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_UP + "_" + AvatarPartInfo.WING] = 5;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_UP + "_" + AvatarPartInfo.MOUNT] = 6;
        this.dic[AvatarActions.ACTION_WALK + "_" + AvatarDirections.DIRECTION_UP + "_" + AvatarPartInfo.BODY] = 7;
    }

    public static getBaseNumByType(actionType: string, action: string, isMounting: boolean = false, isStandMount: boolean = false, job: number = 0, sex: number = 2): any[] {
        if (!isMounting) {
            if (actionType == AvatarActionType.WALK) {
                switch (action) {
                    case AvatarPosition.BODY:
                        return AvatarStaticData.BODY_WALK;
                    case AvatarPosition.ARMY:
                        return AvatarStaticData.ARMY_WALK;
                    case AvatarPosition.HAIR_UP:
                        if (this.isWarriorMan(job, sex)) {
                            return AvatarStaticData.WARRIOR_MAN_HAIR_UP_WALK;
                        }
                        return AvatarStaticData.HAIR_UP_WALK;
                    case AvatarPosition.HAIR_DOWN:
                        if (this.isWarriorMan(job, sex)) {
                            return AvatarStaticData.WARRIOR_MAN_HAIR_DOWN_WALK;
                        }
                        return AvatarStaticData.HAIR_DOWN_WALK;
                    case AvatarPosition.CLOAK:
                        return AvatarStaticData.CLOAK_WALK;
                    case AvatarPosition.WING:
                        if (this.isWarriorMan(job, sex)) {
                            return AvatarStaticData.WARRIOR_MAN_WING_WALK;
                        }
                        return AvatarStaticData.WING_WALK;
                    case AvatarPosition.PET:
                        return AvatarStaticData.PET_WALK;
                }
            }
            else if (actionType == AvatarActionType.STAND) {
                switch (action) {
                    case AvatarPosition.BODY: return AvatarStaticData.BODY_STAND;
                    case AvatarPosition.ARMY: return AvatarStaticData.ARMY_STAND;
                    case AvatarPosition.HAIR_UP: return AvatarStaticData.HAIR_UP_STAND;
                    case AvatarPosition.HAIR_DOWN: return AvatarStaticData.HAIR_DOWN_STAND;
                    case AvatarPosition.CLOAK: return AvatarStaticData.CLOAK_STAND;
                    case AvatarPosition.WING: return AvatarStaticData.WING_STAND;
                    case AvatarPosition.PET: return AvatarStaticData.PET_STAND;
                }
            }
        } else {
            if (actionType == AvatarActionType.WALK) {
                switch (action) {
                    case AvatarPosition.BODY: return AvatarStaticData.BODY_WALK_MOUNT;
                    case AvatarPosition.ARMY: return AvatarStaticData.ARMY_WALK_MOUNT;
                    case AvatarPosition.HAIR_UP: return AvatarStaticData.HAIR_UP_WALK_MOUNT;
                    case AvatarPosition.HAIR_DOWN: return AvatarStaticData.HAIR_DOWN_WALK_MOUNT;
                    case AvatarPosition.CLOAK: return AvatarStaticData.CLOAK_WALK_MOUNT;
                    case AvatarPosition.WING: return AvatarStaticData.WING_WALK_MOUNT;
                    case AvatarPosition.MOUNT: return AvatarStaticData.MOUNT_WALK_MOUNT;
                    case AvatarPosition.PET: return AvatarStaticData.PET_WALK_MOUNT;
                }
            }
            else if (actionType == AvatarActionType.STAND) {
                switch (action) {
                    case AvatarPosition.BODY: return isStandMount ? AvatarStaticData.BODY_STAND_MOUNT_STANDPOS : AvatarStaticData.BODY_STAND_MOUNT;
                    case AvatarPosition.ARMY: return isStandMount ? AvatarStaticData.ARMY_STAND_MOUNT_STANDPOS : AvatarStaticData.ARMY_STAND_MOUNT;
                    case AvatarPosition.HAIR_UP: return AvatarStaticData.HAIR_UP_STAND_MOUNT;
                    case AvatarPosition.HAIR_DOWN: return AvatarStaticData.HAIR_DOWN_STAND_MOUNT;
                    case AvatarPosition.CLOAK: return AvatarStaticData.CLOAK_STAND_MOUNT;
                    case AvatarPosition.WING: return AvatarStaticData.WING_STAND_MOUNT;
                    case AvatarPosition.MOUNT: return AvatarStaticData.MOUNT_STAND_MOUNT;
                    case AvatarPosition.PET: return AvatarStaticData.PET_STAND_MOUNT;
                }
            }
        }
        return [];
    }

    public static isWarriorMan(job: number, sex: number) {
        return job == JobType.WARRIOR && sex == 1
    }

    /**
     * 获取指定朝向经过加上偏移量的渲染排序值（当偏移量为不0时会新建副本）
     * @param actionType
     * @param action
     * @param isMounting
     * @param index
     * @param offset
     * @return 
     * 
     */
    public static getSetOffsetArray(actionType: string, action: string, isMounting: boolean, directionDataList: any[]): any[] {
        let result: any[] = AvatarStaticData.getBaseNumByType(actionType, action, isMounting);
        let hasOffset: boolean = false;
        for (let index = 0; index < directionDataList.length; index++) {
            const curDirectionData = directionDataList[index];
            for (const key in curDirectionData) {
                if (Object.prototype.hasOwnProperty.call(curDirectionData, key)) {
                    const curRenderIndex = curDirectionData[key];
                    if (curRenderIndex != 0) {
                        hasOffset = true;
                        break;
                    }
                }
            }
        }

        if (hasOffset) {
            let offset: number;
            let cloneArr: any[] = new Array();
            result = cloneArr.concat(result);
            for (let index = 0; index < directionDataList.length; index++) {
                const curDirectionData = directionDataList[index];
                for (const key in curDirectionData) {
                    if (Object.prototype.hasOwnProperty.call(curDirectionData, key)) {
                        const curDirectionKey = curDirectionData[key];
                        offset = curDirectionData[curDirectionKey];
                        result[curDirectionKey] += offset;
                    }
                }
            }
        }
        return result;
    }
}
