// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2023-11-13 11:22:08
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-04 12:31:03
 * @Description: 城战公会信息
 */

import { CampType } from "../../../constant/Const";

export class OuterCityWarGuildInfo {
        public guildId: number;
        public guildName: string;
        //状态  1正常 2被击退
        public guildStatus: number;
        //公会积分
        private _guildScore: number = 0;
        set guildScore(v: number) {
            this._guildScore = v < 0 ? 0 : v;
        }
        get guildScore(): number {
            return this._guildScore
        }
        //阵营 1 进攻 2 防守
        public camp: CampType;
}