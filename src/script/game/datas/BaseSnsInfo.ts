// @ts-nocheck
import LangManager from '../../core/lang/LangManager';
import {SNSModel} from './model/SNSModel';
import {SNSManager} from '../manager/SNSManager';
import Logger from '../../core/logger/Logger';

export class BaseSnsInfo
{
    public userId:number = 0;
    public nickName:string = "";
    /**
     *签名
     */
    public sign:string = "";
    /**
     *性别ID
     */
    public sex:number = 0;
    /**
     *生日类型（公历或农历）
     */
    public birthdayType:number = 0;
    /**
     *出生年
     */
    public birthYear:number = 0;
    /**
     *出生月
     */
    public birthMonth:number = 0;
    /**
     *出生日
     */
    public birthDay:number = 0;
    /**
     *星座ID
     */
    public horoscope:number = 0;
    /**
     *血型ID
     */
    public bloodType:number = 0;
    /**
     *国家ID
     */
    public country:number = 0;
    /**
     *省份ID
     */
    public province:number = 0;
    /**
     *城市ID
     */
    public city:number = 0;

    /**
     * 头像ID
     */
    public get headId():number
    {
        return this._headId;
    }

    public set headId(value:number)
    {
        if(value > 0)
        {
            this._headId = value;
        }
    }

    private _headId:number = 0;

    constructor()
    {
    }

    private get snsModel():SNSModel
    {
        return SNSManager.Instance.model;
    }

    /**
     * 性别
     */
    public get sexName():string
    {
        return this.snsModel.sexList[this.sex] ? this.snsModel.sexList[this.sex]["name"] : LangManager.Instance.GetTranslation("friends.findfriend.FindResultItem.unknown");
    }

    /**
     * 星座名
     */
    public get horoscopeName():string
    {
        return this.snsModel.getHoroscopeObj(this.horoscope) ? this.snsModel.getHoroscopeObj(this.horoscope)["name"] : LangManager.Instance.GetTranslation("friends.findfriend.FindResultItem.unknown");
    }

    /**
     * 血型名
     */
    public get bloodName():string
    {
        return this.snsModel.bloodTypeList[this.bloodType] ? this.snsModel.bloodTypeList[this.bloodType]["name"] : LangManager.Instance.GetTranslation("friends.findfriend.FindResultItem.unknown");
    }

    /**
     * 国家名
     */
    public get countryName():string
    {
        return this.snsModel.getCountryObj(this.country) ? this.snsModel.getCountryObj(this.country)["name"] : LangManager.Instance.GetTranslation("friends.findfriend.FindResultItem.unknown");
    }

    /**
     * 省名
     */
    public get provinceName():string
    {
        return this.snsModel.getProvinceObj(this.province) ? this.snsModel.getProvinceObj(this.province)["name"] : "";
    }

    /**
     * 城市名
     */
    public get cityName():string
    {
        return this.snsModel.getCityObj(this.city) ? this.snsModel.getCityObj(this.city)["name"] : "";
    }

    /**
     * 是否填完资料
     */
    public get isFillOut():boolean
    {
        if(this.sex > 0 && this.bloodType > 0 && this.birthYear > 0 && this.birthMonth > 0 && this.birthDay > 0
            && this.horoscope > 0 && this.country > 0 && this.province > 0 && this.city > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * 重置资料
     */
    public reset()
    {
        this.sex = 0;
        this.birthdayType = 0;
        this.birthYear = 0;
        this.birthMonth = 0;
        this.birthDay = 0;
        this.horoscope = 0;
        this.bloodType = 0;
        this.country = 0;
        this.province = 0;
        this.city = 0;
    }

}