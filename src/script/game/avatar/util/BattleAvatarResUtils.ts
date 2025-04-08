import { GameLoadNeedData } from "../../battle/data/GameLoadNeedData"
import { HeroLoadDataFactory } from "../../battle/utils/HeroLoadDataFactory"

/*
 * @Author: jeremy.xu
 * @Date: 2024-04-28 11:19:11
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-28 14:43:10
 * @DemandLink: 
 * @Description:
 */
export class BattleAvatarResUtils{
    
    // 战斗模型资源部分有偏移
    static fixResOffset(data:GameLoadNeedData): [number, number] {
        let fixX = 0
        let fixY = 0

        // 1:战士  2:弓手  3:法师
        if (data.urlPath.indexOf("wing_magicball/2_0/") != -1) { // 女弓-魔法舞会翅膀
            fixX = -50
        } else if(data.urlPath.indexOf("wing_firephoenix/2_0/") != -1) {// 女弓- 浴火之凤翅膀
            fixX = -50
        }
        else if (data.urlPath.indexOf("fashion_weapon_haunt/2_0/") != -1) { // 女弓-鬼影重重武器
            fixX = -45
        } else if (data.urlPath.indexOf("wing_haunt/2_0/") != -1) { // 女弓-鬼影重重翅膀
            fixX = -37
        } else if (data.urlPath.indexOf("wing_tombraider/2_0/") != -1) { // 女弓-探险者翅膀
            if ((data.sPart + data.level) == HeroLoadDataFactory.PART_CLOAK2) {
                fixX = -35
            }
        }else if (data.urlPath.indexOf("wing_flower_whisper/2_0/") != -1) { // 女弓-时光花语之翼
            if ((data.sPart + data.level) == HeroLoadDataFactory.PART_CLOAK2) {
                fixX = -35
            }
        }else if (data.urlPath.indexOf("fashion_hat_death01/2_0/") != -1) {
            if ((data.sPart + data.level) == HeroLoadDataFactory.PART_HAIR1) {
                fixX = -35
            }
        }else if (data.urlPath.indexOf("wing_shadowdevil/2_1/") != -1) {
                fixX = 35
                fixY = 30
        } else if (data.urlPath.indexOf("warrior_arms017/1/") != -1) {
            fixY = -57
        }
        else if (data.urlPath.indexOf("fashion_cloth_forest/2_0") != -1) {
            fixX = -37
        }
        else if (data.sPart == HeroLoadDataFactory.PART_ARMS) {
            if (data) {
                if (data.urlPath.indexOf("fashion_weapon_span/1_1/") != -1) {
                    fixY = -60
                } else if (data.urlPath.indexOf("fashion_weapon_span/2_0/") != -1) {
                    fixX = -35
                    fixY = -5
                }
            }
        }
        return [fixX, fixY]
    }
}