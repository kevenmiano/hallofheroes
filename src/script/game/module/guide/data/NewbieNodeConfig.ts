/*
 * @Author: jeremy.xu
 * @Date: 2023-08-08 17:46:41
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-06-26 14:22:17
 * @Description: 新手节点配置
 * 1.nodeId=0 
 *   检查主节点是否可以触发；
 *   检查主节点是否可以跳过, 成功跳过需要记录主节点ID至服务器
 */

import { NewbieMainNodeInfo } from "./NewbieMainNodeInfo"

export class NewbieNodeConfig {
    static nodelist = [
        /**
         * 进内城前新手副本引导
         */
        new NewbieMainNodeInfo(10, 1000, false, [
            // 进入新手
            //主节点触发条件: 在新手第一层地图
            //主节点跳过条件: 打死第一只怪物(在第一层新手地图)||结束任务突破防线45(不在新手第一层地图, 获取不到1000103状态)
            {
                "nodeId": 0, "needWaitForComplete": "",
                "actionType": "a6", "actionParams": "", "conditions": "c2", "conditionParams": "3,10001", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c12,c7", "skipConditionParams": "45|1000103,8", "skipConditionInverted": "", "skipConditionSymbol": "1", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "",
                "actionType": "a1", "actionParams": "0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1",
                "actionType": "a45", "actionParams": "0,7,1591,582,1308,0,4,1", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 20, "needWaitForComplete": "1",
                "actionType": "a7", "actionParams": "1", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 25, "needWaitForComplete": "",
                "actionType": "a3", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(20, 990, false, [
            // 消灭第1只怪   
            //主节点触发条件: 在战斗场景&&第一个怪在战斗状态
            //主节点跳过条件: 打死第一只怪物(在第一层新手地图)||结束任务突破防线45(不在新手第一层地图, 获取不到1000103状态)
            {
                "nodeId": 0, "needWaitForComplete": "",
                "actionType": "a6", "actionParams": "", "conditions": "c2,c9,c7", "conditionParams": "4|21|1000103,4", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c12,c7", "skipConditionParams": "45|1000103,8", "skipConditionInverted": "", "skipConditionSymbol": "1", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "",
                "actionType": "a39", "actionParams": "1,-1", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "", "skipConditionParams": "", "skipConditionInverted": "", "skipConditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "",
                "actionType": "a6", "actionParams": "", "conditions": "c7", "conditionParams": "1000103,8", "conditionInverted": "", "conditionSymbol": "",
            }
        ]),
        new NewbieMainNodeInfo(50, 980, false, [
            // 使用技能-消灭第2只怪
            //主节点触发条件: 在战斗场景&&第二个怪在战斗状态
            //主节点跳过条件: 打死第二只怪物(在第一层新手地图)||结束任务突破防线45(不在新手第一层地图, 获取不到1000103状态)
            {
                "nodeId": 0, "needWaitForComplete": "",
                "actionType": "a6", "actionParams": "", "conditions": "c2,c9,c7", "conditionParams": "4|21|1000104,4", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c12,c7", "skipConditionParams": "45|1000104,8", "skipConditionInverted": "", "skipConditionSymbol": "1", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "",
                "actionType": "a39", "actionParams": "1,-1", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "",
                "actionType": "a15", "actionParams": "5_0_icon,-184,-180,1501,0,1,5_0,5", "conditions": "c2", "conditionParams": "4", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 20, "needWaitForComplete": "",
                "actionType": "a6", "actionParams": "", "conditions": "c7", "conditionParams": "1000104,8", "conditionInverted": "", "conditionSymbol": "",
            }
        ]),
        new NewbieMainNodeInfo(70, 970, false, [
            // 获得技能-消灭第3只怪
            //主节点触发条件: 在战斗场景&&第三个怪在战斗状态
            //主节点跳过条件: 打死第三只怪物(在第一层新手地图)||结束任务突破防线45(不在新手第一层地图, 获取不到1000103状态)
            {
                "nodeId": 0, "needWaitForComplete": "",
                "actionType": "a6", "actionParams": "", "conditions": "c2,c9,c7", "conditionParams": "4|21|1000106,4", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c12,c7", "skipConditionParams": "45|1000106,8", "skipConditionInverted": "", "skipConditionSymbol": "1", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "",
                "actionType": "a39", "actionParams": "1,-1", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "",
                "actionType": "a19", "actionParams": "1", "conditions": "c2,c7", "conditionParams": "4|1000106,4", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 20, "needWaitForComplete": "1",
                "actionType": "a7", "actionParams": "16", "conditions": "c2", "conditionParams": "4", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 25, "needWaitForComplete": "",
                "actionType": "a39", "actionParams": "1,202", "conditions": "c2", "conditionParams": "4", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 30, "needWaitForComplete": "",
                "actionType": "a15", "actionParams": "5_1_icon,-184,-160,点击使用“裂风”技能,2,1,5_1,5", "conditions": "c2", "conditionParams": "4", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 35, "needWaitForComplete": "",
                "actionType": "a19", "actionParams": "0", "conditions": "c2", "conditionParams": "4", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 40, "needWaitForComplete": "",
                "actionType": "a6", "actionParams": "", "conditions": "c7", "conditionParams": "1000106,8", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(90, 960, false, [
            // 蒂娜疗伤
            //主节点触发条件: 在新手第一层场景&&第三个怪死亡
            //主节点跳过条件: 结束任务突破防线45
            {
                "nodeId": 0, "needWaitForComplete": "",
                "actionType": "a6", "actionParams": "", "conditions": "c2,c7", "conditionParams": "3,10001|1000106,8", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c12", "skipConditionParams": "45", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "",
                "actionType": "a50", "actionParams": "0,1400,380,170", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "",
                "actionType": "a50", "actionParams": "1000107,1320,340,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "1",
                "actionType": "a7", "actionParams": "3", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 20, "needWaitForComplete": "1",
                "actionType": "a32", "actionParams": "31", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            }
        ]),
        new NewbieMainNodeInfo(110, 950, false, [
            // 传送阵介绍
            //主节点触发条件: 在新手第一层场景&&第三个怪死亡&&90
            //主节点跳过条件: 结束任务突破防线45
            {
                "nodeId": 0, "needWaitForComplete": "",
                "actionType": "a6", "actionParams": "", "conditions": "c2,c7,c24", "conditionParams": "3,10001|1000106,8|90", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c12", "skipConditionParams": "45", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "",
                "actionType": "a50", "actionParams": "0,1400,380,170", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "",
                "actionType": "a50", "actionParams": "1000107,1320,340,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "1",
                "actionType": "a9", "actionParams": "1000107,-1,-1,68,18,1", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 25, "needWaitForComplete": "1",
                "actionType": "a7", "actionParams": "4", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 30, "needWaitForComplete": "",
                "actionType": "a31", "actionParams": "10001,1000106,2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 35, "needWaitForComplete": "",
                "actionType": "a3", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            }
        ]),
        new NewbieMainNodeInfo(140, 940, false, [
            // 消灭第二层第1只怪
            //主节点触发条件: 在新手第二层场景&&第一个怪死亡
            //主节点跳过条件: 结束任务突破防线45||完成任务突破防线45
            {
                "nodeId": 0, "needWaitForComplete": "",
                "actionType": "a6", "actionParams": "", "conditions": "c2,c7", "conditionParams": "3,10002|1000203,8", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c12,c4", "skipConditionParams": "45|45", "skipConditionInverted": "", "skipConditionSymbol": "1", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "",
                "actionType": "a6", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            }
        ]),
        // 
        new NewbieMainNodeInfo(150, 930, false, [
            // 消灭第二层第2只怪
            //主节点触发条件: 在新手第二层场景&&第二个怪死亡
            //主节点跳过条件: 服务器打完第二层第2只怪, 也会设置节点150, 此节点不跳过
            {
                "nodeId": 0, "needWaitForComplete": "",
                "actionType": "a6", "actionParams": "", "conditions": "c2,c7", "conditionParams": "3,10002|1000205,8", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "", "skipConditionParams": "", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "",
                "actionType": "a6", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            }
        ]),


        /**
         * 进内城后引导
         */
        new NewbieMainNodeInfo(200, 0, true, [
            // 打开内政厅界面
            //主节点触发条件: 等级5
            //主节点跳过条件: 等级大于5
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "5", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "6", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,200,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(202, 0, false, [
            // 指引-突破敌人45
            //主节点触发条件: 任务存在&&任务已完成
            //主节点跳过条件: 任务已提交完成
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c2,c4,c9", "conditionParams": "1|45|3,45", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1,c12", "skipConditionParams": "6|45", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            // {
            //     "nodeId": 5, "needWaitForComplete": "0",
            //     "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            // },
            {
                "nodeId": 10, "needWaitForComplete": "1",
                "actionType": "a11", "actionParams": "1,10000,45", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 12, "needWaitForComplete": "1",
                "actionType": "a11", "actionParams": "0", "conditions": "c12", "conditionParams": "45", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(204, 0, false, [
            // 指引-升级内政厅51
            //主节点触发条件: 任务存在
            //主节点跳过条件: 任务已提交完成&&任务完成
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c2,c9", "conditionParams": "1|3,51", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c12,c4", "skipConditionParams": "51|51", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            // {
            //     "nodeId": 5, "needWaitForComplete": "0",
            //     "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            // },
            {
                "nodeId": 10, "needWaitForComplete": "1",
                "actionType": "a11", "actionParams": "1,10001,51", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 12, "needWaitForComplete": "1",
                "actionType": "a11", "actionParams": "0", "conditions": "c4", "conditionParams": "51", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(205, 0, false, [
            // 指引-完成内政厅51
            //主节点触发条件: 任务存在&&任务完成
            //主节点跳过条件: 任务已提交完成
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c2,c9,c4", "conditionParams": "1|3,51|51", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c12", "skipConditionParams": "51", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1",
                "actionType": "a11", "actionParams": "1,10000,51", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "1",
                "actionType": "a11", "actionParams": "0", "conditions": "c12", "conditionParams": "51", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 20, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(210, 0, true, [
            // 打开兵营界面
            //主节点触发条件: 等级5
            //主节点跳过条件: 等级大于5
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "5", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "6", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,210,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(211, 0, true, [
            // 打开征战界面
            //主节点触发条件: 等级5-8
            //主节点跳过条件: 等级大于8
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "5", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "9", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,211,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]), 
        new NewbieMainNodeInfo(212, 0, true, [
            // 打开打开单人战役界面
            //主节点触发条件: 等级6 && 当前选中战役扫荡按钮可点时
            //主节点跳过条件: 等级大于8
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1,c9", "conditionParams": "6|30", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "9", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "300_SelectCampaignWnd_btnSweep,150,-160,212,1", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(214, 0, true, [
            // 打开技能界面
            //主节点触发条件: 等级6
            //主节点跳过条件: 等级大于8
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "6", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "9", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,214,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(220, 0, true, [
            // 进入铁匠铺-强化分页
            //主节点触发条件: 等级9
            //主节点跳过条件: 等级大于10
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "9", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "11", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1", "delayTime": "500",
                "actionType": "a17", "actionParams": "0,0,0,220,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(230, 0, true, [
            // 打开农场界面
            //主节点触发条件: 等级12
            //主节点跳过条件: 等级大于15
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1,c9", "conditionParams": "12|27", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "16", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,230,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 20, "needWaitForComplete": "",
                "actionType": "a22", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 25, "needWaitForComplete": "1",
                "actionType": "a17", "actionParams": "114,-300,300,231,1", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 30, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(240, 0, true, [
            // 打开公会界面
            //主节点触发条件: 等级13 && 已加入公会时
            //主节点跳过条件: 等级大于20
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1,c25", "conditionParams": "13", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "21", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,240,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(250, 0, true, [
            // 进入铁匠铺-镶嵌分页
            //主节点触发条件: 等级15
            //主节点跳过条件: 等级大于15
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "15", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "16", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,250,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(260, 0, true, [
            // 打开悬赏界面
            //主节点触发条件: 等级17
            //主节点跳过条件: 等级大于20
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "17", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "21", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,260,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(270, 0, true, [
            // 打开地下迷宫界面
            //主节点触发条件: 等级23
            //主节点跳过条件: 等级大于25
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "23", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "26", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,270,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(280, 0, true, [
            // 打开占星界面
            //主节点触发条件: 等级25
            //主节点跳过条件: 等级大于30
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "25", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "31", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,280,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "",
                "actionType": "a22", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 20, "needWaitForComplete": "1",
                "actionType": "a17", "actionParams": "0,0,0,281,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 25, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(290, 0, true, [
            // 打开坐骑界面
            //主节点触发条件: 等级35
            //主节点跳过条件: 等级大于40
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "35", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "41", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,290,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(300, 0, true, [
            // 进入技能-符文分页
            //主节点触发条件: 等级35
            //主节点跳过条件: 等级大于40
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "35", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "41", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,300,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(310, 0, true, [
            // 打开英灵界面
            //主节点触发条件: 等级40
            //主节点跳过条件: 等级大于45
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "40", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "46", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,310,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(320, 0, true, [
            // 打开英灵战役界面
            //主节点触发条件: 等级40
            //主节点跳过条件: 等级大于45
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "40", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "46", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,320,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(330, 0, true, [
            // 打开英灵远征界面
            //主节点触发条件: 等级45
            //主节点跳过条件: 等级大于50
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "45", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "51", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,330,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(340, 0, true, [
            // 进入技能-天赋分页
            //主节点触发条件: 等级50
            //主节点跳过条件: 等级大于52
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "50", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "53", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,340,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(350, 0, true, [
            // 打开龙纹
            //主节点触发条件: 等级55
            //主节点跳过条件: 等级大于80
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "55", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "81", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,350,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(360, 0, true, [
            // 打开龙纹升级界面
            //主节点触发条件: 等级55
            //主节点跳过条件: 等级大于80
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "55", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "81", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,360,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(370, 0, true, [
            // 打开专精界面
            //主节点触发条件: 等级55
            //主节点跳过条件: 等级大于56
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "55", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "57", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1",
                "actionType": "a17", "actionParams": "0,0,0,370,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a22", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 20, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,371,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 25, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(374, 0, true, [
            // 打开专精技能界面
            //主节点触发条件: 等级55
            //主节点跳过条件: 等级大于56
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "55", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "57", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "",
                "actionType": "a17", "actionParams": "0,0,0,374,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(380, 0, true, [
            // 打开秘境界面
            //主节点触发条件: 等级55
            //主节点跳过条件: 等级大于56
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "55", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "257", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,380,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(400, 0, true, [
            // 打开市场商品列表页签
            //主节点触发条件: 等级40
            //主节点跳过条件: 等级大于80
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "40", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "81", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,400,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(401, 0, true, [
            // 打开市场商品详情界面
            //主节点触发条件: 等级40
            //主节点跳过条件: 等级大于80
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "40", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "81", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,401,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
        new NewbieMainNodeInfo(402, 0, true, [
            // 打开市场商品出售界面
            //主节点触发条件: 等级40
            //主节点跳过条件: 等级大于80
            {
                "nodeId": 0, "needWaitForComplete": "0",
                "actionType": "a6", "actionParams": "", "conditions": "c1", "conditionParams": "40", "conditionInverted": "", "conditionSymbol": "",
                "skipConditions": "c1", "skipConditionParams": "81", "skipConditionInverted": "", "skipConditionSymbol": "", "backConditions": "", "backConditionParams": "", "backConditionInverted": "", "backConditionSymbol": "", "backId": "", "delayTime": "", "saveId": "", "nextId": "", "desc": "",
            },
            {
                "nodeId": 5, "needWaitForComplete": "0",
                "actionType": "a1", "actionParams": "0.2", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 10, "needWaitForComplete": "1", "recordFinish": "1",
                "actionType": "a17", "actionParams": "0,0,0,402,0", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
            {
                "nodeId": 15, "needWaitForComplete": "0",
                "actionType": "a23", "actionParams": "", "conditions": "", "conditionParams": "", "conditionInverted": "", "conditionSymbol": "",
            },
        ]),
    ]
}