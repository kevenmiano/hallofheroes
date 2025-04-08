// @ts-nocheck
export class PlayerEffectInfo {
    /**************值加成*************/
    private _buildTimeAddition: number = 0;//建筑建造时间加成
    private _tecResoueceAddition: number = 0;//科技建造时间加成
    private _storeLimitAddition: number = 0;//仓库最大容量加成
    private _recruitPawnResourceAddition: number = 0;//招募士兵消耗资源加成
    private _pawnUpgradeSoulAddition: number = 0;//兵种升级需要战魂加成
    private _transferPowerLimitAddition: number = 0;//传送阵能量上限加成
    private _transferCoolTimeAddition: number = 0;//传送阵冷却时间加成

    /**************比例加成*************/
    private _buildTimeAdditionRace: number = 0;//建筑建造时间加成
    private _tecResoueceAdditionRace: number = 0;//科技建造时间加成
    private _storeLimitAdditionRace: number = 0;//仓库最大容量加成
    private _recruitPawnResourceAdditionRace: number = 0;//招募士兵消耗资源加成
    private _pawnUpgradeSoulAdditionRace: number = 0;//兵种升级需要战魂加成
    private _transferPowerLimitAdditionRace: number = 0;//传送阵能量上限加成
    private _transferCoolTimeAdditionRace: number = 0;//传送阵冷却时间加成

    public set buildTimeAddition(value: number) {
        this._buildTimeAddition = value;
    }

    public set tecResoueceAddition(value: number) {
        this._tecResoueceAddition = value;
    }

    public set storeLimitAddition(value: number) {
        this._storeLimitAddition = value;
    }

    public set recruitPawnResourceAddition(value: number) {
        this._recruitPawnResourceAddition = value;
    }

    public set pawnUpgradeSoulAddition(value: number) {
        this._pawnUpgradeSoulAddition = value;
    }

    public set transferPowerLimitAddition(value: number) {
        this._transferPowerLimitAddition = value;
    }

    public set transferCoolTimeAddition(value: number) {
        this._transferCoolTimeAddition = value;
    }

    public set buildTimeAdditionRace(value: number) {
        this._buildTimeAdditionRace = value;
    }

    public set tecResoueceAdditionRace(value: number) {
        this._tecResoueceAdditionRace = value;
    }

    public set storeLimitAdditionRace(value: number) {
        this._storeLimitAdditionRace = value;
    }

    public set recruitPawnResourceAdditionRace(value: number) {
        this._recruitPawnResourceAdditionRace = value;
    }

    public set pawnUpgradeSoulAdditionRace(value: number) {
        this._pawnUpgradeSoulAdditionRace = value;
    }

    public set transferPowerLimitAdditionRace(value: number) {
        this._transferPowerLimitAdditionRace = value;
    }

    public set transferCoolTimeAdditionRace(value: number) {
        this._transferCoolTimeAdditionRace = value;
    }

    /**
     * 建造时间加成以后的值
     * @param value
     * @return
     *
     */
    public getBuildTimeAdditionValue(value: number): number {
        return value * (1 + this._buildTimeAdditionRace / 100) + this._buildTimeAddition;
    }

    /**
     *  兵种升级所需战魂加成以后的值
     * @param value
     * @return
     *
     */
    public getPawnUpgradeSoulAddition(value: number): number {
        return value * (1 + this._pawnUpgradeSoulAdditionRace / 100) + this._pawnUpgradeSoulAddition;
    }

    /**
     * 招募士兵所需资源加成以后的值
     * @param value
     * @return
     *
     */
    public getRecruitPawnResourceAddition(value: number): number {
        return value * (1 + this._recruitPawnResourceAdditionRace / 100) + this._recruitPawnResourceAddition;
    }

    /**
     * 传送阵能量上限加成值
     * @param value
     * @return
     *
     */
    public getTransferPowerLimitAddition(value: number): number {
        return value * (1 + this._transferPowerLimitAdditionRace / 100) + this._transferPowerLimitAddition;
    }

    /**
     * 传送阵冷却时间加成值
     * @param value
     * @return
     *
     */
    public getTransferCoolTimeAddition(value: number): number {
        return value * (1 + this._transferCoolTimeAdditionRace / 100) + this._transferCoolTimeAddition;
    }
}