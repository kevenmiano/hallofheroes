import Dictionary from "../../../../core/utils/Dictionary";

/**
 * 采集本机器人的配置数据 
 * 
 */
export class CollectionRobotData {
    private static _robotData: Dictionary

    private static setup() {
        CollectionRobotData._robotData = new Dictionary();
        CollectionRobotData._robotData[7001] = { body: 'warrior_body023', army: 'warrior_arms002', job: 1, sex: 0 };
        CollectionRobotData._robotData[7002] = { body: 'warrior_body023', army: 'warrior_arms002', job: 1, sex: 0 };
        CollectionRobotData._robotData[7003] = { body: 'warrior_body023', army: 'warrior_arms002', job: 1, sex: 0 };
        CollectionRobotData._robotData[7004] = { body: 'warrior_body023', army: 'warrior_arms002', job: 1, sex: 0 };

        CollectionRobotData._robotData[7005] = { body: 'warrior_body023', army: 'warrior_arms002', job: 1, sex: 1 };
        CollectionRobotData._robotData[7006] = { body: 'warrior_body023', army: 'warrior_arms002', job: 1, sex: 1 };
        CollectionRobotData._robotData[7007] = { body: 'warrior_body023', army: 'warrior_arms002', job: 1, sex: 1 };
        CollectionRobotData._robotData[7008] = { body: 'warrior_body023', army: 'warrior_arms002', job: 1, sex: 1 };
    }

    public static get robotData(): Dictionary {
        if (!CollectionRobotData._robotData) CollectionRobotData.setup();
        return CollectionRobotData._robotData;
    }
}