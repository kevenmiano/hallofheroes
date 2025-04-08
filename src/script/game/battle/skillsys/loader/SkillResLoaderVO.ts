/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2020-11-27 18:19:00
 * @LastEditTime: 2022-11-03 15:58:54
 * @LastEditors: jeremy.xu
 * @Description: 
 */
export class SkillResLoaderVO
{
    public skillId : number = 0;
    public sex : number = 0;
    constructor(skillId : number, sex : number)
    {
        this.skillId = Number(skillId);
        this.sex = sex;
    }
}