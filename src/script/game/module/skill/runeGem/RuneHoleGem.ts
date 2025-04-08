import FUI_RuneHole from "../../../../../fui/Skill/FUI_RuneHole";
import FUI_RuneHoleGem from "../../../../../fui/Skill/FUI_RuneHoleGem";
import LangManager from "../../../../core/lang/LangManager";
import { t_s_runegemData } from "../../../config/t_s_runegem";
import { t_s_runeholeData } from "../../../config/t_s_runehole";
import { BagType } from "../../../constant/BagDefine";
import { RuneEvent } from "../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { RuneInfo } from "../../../datas/RuneInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import SkillWndData from "../SkillWndData";
import { GemAttriItem } from "./GemAttriItem";
import { RuneGemItem } from "./RuneGemItem";

/**
 * 符文石镶嵌
 */
 export default class RuneHoleGem extends FUI_RuneHoleGem{

    /** 符文石装备背包(已经镶嵌的符文石) */
    private _curList:GoodsInfo[];
    private _bagData:GoodsInfo[];
    public curHoleIndex:number = 0;//当前选中的符文孔的索引
    public curGemIndex:number = 0;//当前选中的符石的索引
    private _runeType:number;
    private _runeInfo:RuneInfo;
    public hasInlayGem:boolean=false;
    public isunload:boolean = false;//是否卸载
    public isInlay:boolean = false;//是否镶嵌

    onConstruct() {
        super.onConstruct();
        this._curList = [];
        this.initRuneHole();
        this.txt_desc0.text = LangManager.Instance.GetTranslation('runeGem.str10');
        // this.btn_resolve.title = LangManager.Instance.GetTranslation('runeGem.str4');
        // this.btn_choose.title = LangManager.Instance.GetTranslation('runeGem.str3');
        RuneHoleGem.selectRuneGem = false;
    }

    /**
     * 更新镶嵌的符文石
     * //符文空的位置=（符文类型-1）*10+index 
     */
    updateRuneGem(){
        if(this.isunload){
            this.isunload = false;
            RuneHoleGem.selectRuneGem = false;
            //卸载后选中原来的符孔位置
            this.unselectOther();
            this.curHoleIndex = this.curGemIndex;
            let hole = this.getChild('rune_hole_'+(this.curHoleIndex+1)) as FUI_RuneHole;
            hole.getChild('img_select').visible = true;

        }
        if(this.isInlay){
            this.isInlay = false;
            RuneHoleGem.selectRuneGem = true;
        }
        this.hasInlayGem = false;
        for (let i = 1; i <= 5; i++) {
            let gem = this.getChild('rune_gem_'+i) as RuneGemItem;
            gem.visible = false;  
        }
        this.attriMap = {};
        this._bagData = GoodsManager.Instance.getGoodsByBagType(BagType.RUNE_EQUIP);
        if(this._bagData.length > 0){
            for (let i = 0; i < this._bagData.length; i++) {
                const goodsInfo = this._bagData[i];  
                let index = goodsInfo.pos - (this._runeType -1) * 10
                let gem = this.getChild('rune_gem_'+ (index+1)) as RuneGemItem;
                if(gem){
                    gem.info = goodsInfo;
                    gem.visible = true;
                    this.hasInlayGem = true;

                    this['attri_'+(index+1)].getControllerAt(0).setSelectedIndex(0);
                    this['attri_'+(index+1)].visible = true;
                    if(goodsInfo.strengthenGrade == 0){
                        this.addPropertyTxt1(goodsInfo.templateInfo.Property1,goodsInfo,index+1); 
                    }else{
                        let curTemp:t_s_runegemData = TempleteManager.Instance.getRuneGemCfgByTypeAndLevel(goodsInfo.templateInfo.SonType, goodsInfo.strengthenGrade,goodsInfo.templateInfo.Property1);
                        if(curTemp){
                            this.addPropertyTxt(curTemp,goodsInfo,index+1); 
                        }
                    }
                }
            }
        }
    }
    private attriMap = {};

    protected addPropertyTxt1(type:number,info: GoodsInfo,index:number) {
        let str:string='';
        let val:number=0;
        switch (type) {
            case 1:
                str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip01");
                val = info.templateInfo.Power;  
                break;
            case 2:
                str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip02");
                val = info.templateInfo.Agility; 
                break;
            case 3:
                str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip03");
                val = info.templateInfo.Intellect; 
                break;
            case 4:
                str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip04");
                val = info.templateInfo.Physique; 
                break;
            case 5:
                str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip05");
                val = info.templateInfo.Captain; 
                break;
        }
        if(this.attriMap[type]){
            this.attriMap[type] += val;
        }else{
            this.attriMap[type] = val;
        }
        this.updateAttributeTxt(this['attri_'+index],str,val,info);
    }

    initRuneHole(){
        for (let i = 1; i <= 5; i++) {
            let hole = this.getChild('rune_hole_'+i) as FUI_RuneHole;
            hole.getControllerAt(0).setSelectedIndex(i-1);
            hole.offClick(this,this.onClickHole);
            hole.onClick(this,this.onClickHole,[i,hole]);
            hole.visible = false;
            hole.getChild('txt_name').visible = false;
            let gem = this.getChild('rune_gem_'+i) as RuneGemItem;
            gem.offClick(this,this.onClickGem);
            gem.onClick(this,this.onClickGem,[i,gem]);
            // let s_gem = this.getChild('s_gem_'+i) as FUI_RuneGem_S;
            // gem.visible = s_gem.visible = false;
            if(this['img_pro'+i]){
                this['img_pro'+i].visible = false;
                this['img_probg'+i].visible = false;
            }   
        }
        for (let k = 1; k <= 5; k++) {
            this['attri_'+k].visible = false; 
        }
    }

    /**
     * 初始化随机获得的符文孔
     * @param runelHole   符文孔id|形状id  1002,1004,1001|2,4,1
     */
    public updateRuneHole(runeInfo:RuneInfo){
        this._runeInfo = runeInfo;
        this._runeType = runeInfo.templateInfo.RuneType;
        this.initRuneHole();
        let arr = runeInfo.runeHole.split('|');
        let holeIdArr = arr[0].split(',');
        let shapeIdArr = arr[1].split(',');
        let holeData:t_s_runeholeData;
        let index:number=0;
        for (let i = 0; i < holeIdArr.length; i++) {
            const holeId = Number(holeIdArr[i]);
            holeData = TempleteManager.Instance.getRuneHoleTemplateByTid(holeId);
            if(holeData){
                for (let j = 0; j < holeData.Length; j++) {
                    const shapeId = Number(shapeIdArr[index]);
                    index++;

                    this['attri_'+index].getControllerAt(0).setSelectedIndex(1);
                    this['attri_'+index].visible = true;
                    this['attri_'+index].getChild('holeType').asCom.getControllerAt(0).setSelectedIndex(shapeId-1);
                    this['attri_'+index].getChild('txt_name').text = LangManager.Instance.GetTranslation('runeGem.strType'+shapeId);
                  
                    let holeCom = this['rune_hole_'+index] as FUI_RuneHole;
                    if(holeCom){
                        //判断是否连线
                        if(holeData.Length > 1 && j > 0){
                            this['img_pro'+j].visible = true;
                        }
                        holeCom.visible = true;
                        holeCom.getControllerAt(0).setSelectedIndex(shapeId-1);
                    }
                }

                
            }
            
        }

        this.updateRuneGem();
        this.getInayedGemTotalLevel();
        this.updateDesc();
    }

    private updateDesc(){
        let arr = this._runeInfo.runeHole.split('|');
        let holeIdArr = arr[0].split(',');
        let shapeIdArr = arr[1].split(',');
        let holeData:t_s_runeholeData;
        let index:number=0;
        this.descCom.getChild('txt_desc1').text = '';
        let gemEffectDesc:string='';//符石效果描述
        let skillEffectDesc:string='';//技能效果描述
        let effNum:number=0;//效果数量
        for (let i = 0; i < holeIdArr.length; i++) {
            const holeId = Number(holeIdArr[i]);
            holeData = TempleteManager.Instance.getRuneHoleTemplateByTid(holeId);
            if(holeData && (holeData.Condition1 > 0 || holeData.Condition2 >0)){
                //EffectType = 2技能效果, 1符石效果
                if(holeData.EffectType1 == 1){
                    effNum ++;
                    gemEffectDesc = this.getGemEffDesc(effNum,holeData.Condition1,holeData.ConditionParam1,holeData.AttributeType1,holeData.ValueType1,holeData.ValueParam1,holeData.RuneType1);
                }else if(holeData.EffectType1 == 2)
                {
                    effNum++;
                    if(effNum == 2){
                        skillEffectDesc +=  '<br>' +this.getSkillEffDesc(effNum,holeData,holeData.Condition1,holeData.ConditionParam1,holeData.RuneType1);
                    }else{
                        skillEffectDesc =  this.getSkillEffDesc(effNum,holeData,holeData.Condition1,holeData.ConditionParam1,holeData.RuneType1);
                    }
                }
                if(holeData.EffectType2 == 1){
                    effNum++;
                    if(effNum == 2){
                        gemEffectDesc +=  '<br>'  +this.getGemEffDesc(effNum,holeData.Condition2,holeData.ConditionParam2,holeData.AttributeType2,holeData.ValueType2,holeData.ValueParam2,holeData.RuneType2);
                    }else{
                        gemEffectDesc = this.getGemEffDesc(effNum,holeData.Condition2,holeData.ConditionParam2,holeData.AttributeType2,holeData.ValueType2,holeData.ValueParam2,holeData.RuneType2);
                    }
                    
                }else if(holeData.EffectType2 == 2)
                {
                    effNum++;
                    if(effNum == 2){
                        skillEffectDesc +=  '<br>'  +this.getSkillEffDesc(effNum,holeData,holeData.Condition2,holeData.ConditionParam2,holeData.RuneType2);
                    }else{
                        skillEffectDesc =  this.getSkillEffDesc(effNum,holeData,holeData.Condition2,holeData.ConditionParam2,holeData.RuneType2);
                    }
                    
                }
            } 
        }
        this.descCom.getChild('txt_desc1').text = gemEffectDesc +skillEffectDesc;
    }

    /**
     * 当前是否选中了符石, 是的话Tip上要显示替换, 否的话显示镶嵌
     */
    static selectRuneGem:boolean= false;

    /**
     * 点击符文孔 可以镶嵌符文石,筛选孔形状对应的可镶嵌的符文石
     * @param index 
     */
    onClickHole(index:number,hole:FUI_RuneHole){
        this.unselectOther();
        hole.getChild('img_select').visible = true;
        this.curHoleIndex = index-1;
        this.curGemIndex = index-1;
        RuneHoleGem.selectRuneGem = false;
        let shapeId = hole.getControllerAt(0).selectedIndex + 1;
        NotificationManager.Instance.dispatchEvent(RuneEvent.SHOW_INLAY_RUNE_BAG,shapeId);
    }

     /**
     * 当符孔镶嵌符石时, 点击打开符石的TIPS, 点击替换时打开符石独立背包进行镶嵌替换
     * @param index 
     */
    onClickGem(index:number,item:RuneGemItem){
        this.curGemIndex = index-1;
        //显示镶嵌的符文石属性
        this.unselectOther();
        item.getChild('img_select').visible = true;
        
        let shapeId = item.info.templateInfo.Property1
        NotificationManager.Instance.dispatchEvent(RuneEvent.SHOW_INLAY_RUNE_BAG,shapeId);
        //符文石技能效果的描述说明
        RuneHoleGem.selectRuneGem = true;
    }

    protected addPropertyTxt(info: t_s_runegemData,goodsInfo:GoodsInfo,index:number) {
        let type = info.RuneGemTypes;
        let val:number=0;
        switch (type) {
            case 1:
                val = info.Power;
                this.updateAttributeTxt(this['attri_'+index],LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip01"),info.Power,goodsInfo);
                break;
            case 2:
                val = info.Agility;
                this.updateAttributeTxt(this['attri_'+index],LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip02"),info.Agility,goodsInfo);
                break;
            case 3:
                val = info.Intellect;
                this.updateAttributeTxt(this['attri_'+index],LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip03"),info.Intellect,goodsInfo);
                break;
            case 4:
                val = info.Physique;
                this.updateAttributeTxt(this['attri_'+index],LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip04"),info.Physique,goodsInfo);
                break;
            case 5:
                val = info.Captain;
                this.updateAttributeTxt(this['attri_'+index],LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip05"),info.Captain,goodsInfo);
                break;
        }
        if(this.attriMap[type]){
            this.attriMap[type] += val;
        }else{
            this.attriMap[type] = val;
        }
    }

    unselectOther(){
        for (let i = 1; i <= 5; i++) {
            let hole = this.getChild('rune_hole_'+i) as FUI_RuneHole;
            hole.getChild('img_select').visible = false;
            let gem = this.getChild('rune_gem_'+i) as RuneGemItem;
            gem.getChild('img_select').visible = false;
        }
    }

    private updateAttributeTxt(item: GemAttriItem, property: string, value: number, goodsInfo: GoodsInfo) {
        if (value != 0) {
            item.visible = true;
            item.updateText(property, value, goodsInfo);
            item.txt_attributeValue.text = '  +' +value;
            item.getControllerAt(0).setSelectedIndex(0);
        }
        else {
            item.visible = false;
        }
    }
    /**
     * 
     * @param key     int32 power = 1;//力量
    int32 agility = 2;//敏捷
    int32 intel = 3;// 智力
    int32 physi = 4;// 体质
    int32 captain = 5;// 统帅
    int32 attack = 6; //物攻
    int32 defence = 7;//物防
    int32 magicattack = 8;//魔攻
    int32 magicdefence = 9;//魔防
    int32 live = 10; //生命
    int32 conat = 11;	//带兵
    int32 forcehit = 12; //暴击
    int32 parry = 13;	//格档
     * @returns 
     */

    getBaseDesc(key:string):string{
        let str:string='';
        switch (key) {
            case 'power':
                str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip01");
                break;
            case 'agility':
                str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip02");
                break;
            case 'intel':
                str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip03");
                break;
            case 'physi':
                str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip04");
                break;
            case 'captain':
                str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip05");
                break;
            case 'attack':
                str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip13");
                break;
            case 'magicAttack':
                str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip15");
                break;
            case 'defence':
                str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip14");
                break;
            case 'magicDefence':
                str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip16");
                break;
            case 'parry':
                str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip19");
                break;
            case 'live':
                str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip11");
                break;
            case 'forceHit':
                str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip10");
                break;
            case 'conat':
                str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip17");
                break;
        
            default:
                break;
        }
        return str;
    }

    getGemEffDesc(effNum:number,Condition:number,ConditionParam:number,AttributeType:number,ValueType:number,ValueParam:string,RuneType:string):string{
        let str:string= '';
        let isActive = false;
        //判断激活条件-----------------------------------------------------------------------------------------
        if(Condition == 99){
            isActive = this.totalLevel >= ConditionParam;
            str += LangManager.Instance.GetTranslation('runeGem.str25',ConditionParam);
        }else{
            let attriKey = SkillWndData.getAttributeType(Condition);
            str += LangManager.Instance.GetTranslation('runeGem.str35',attriKey,ConditionParam);////激活条件参数ConditionParam1
            isActive = this.checkIsActive(Condition,ConditionParam);
        }

        if(RuneType != '0'){
            let type = this._runeType.toString();
            let typeArr = RuneType.split(',')
            if(typeArr.indexOf(type) == -1){
                isActive = false;
            }else{
                isActive = isActive && true;
            }
        }

        // if(!isActive){
            str = effNum +'.'+LangManager.Instance.GetTranslation('runeGem.str31')+ str;
        // }else{
        //     str = effNum +'.'+ str;
        // }

        //---------------------------------------------------------------------------------------------------

        str += '；' +LangManager.Instance.GetTranslation('runeGem.str32');
        //获得的属性-------------------------------------------------------------------------------------------
        let attriKey = SkillWndData.getAttributeType(AttributeType);
        if(ValueType == 0){//固定值
            str +=  attriKey + '+'+ ValueParam;
            if(!isActive){
                str = '[color=#666666]' + str + '[/color]';
            }
        }else if(ValueType == 1){//百分比 【ValueParam1】会有两个值, 前者为属性类型, 后者为百分比的值
            let arr = ValueParam.split(',');
            if(!isActive){
                str += attriKey+'='+ SkillWndData.getAttributeType(Number(arr[0]),true)+'*'+arr[1]+'%';
                str = '[color=#666666]' + str + '[/color]';
            }else
            {
                //属性类型(该属性类型对应的值从服务器读取)
                let val = this.attriMap[(Number(arr[0]))] || 0;
                str += attriKey + '+'+ val * (Number(arr[1])/100);
            }
            
        }//----------------------------------------------------------------------------------------------------

        return str;
    } 

    // getSvrProperty(attriType:number):number{
    //     return ;
    //     let result:number=0;
    //     switch (attriType) {
    //         case 1:
    //             result = this._runeInfo.baseProperties['power'];
    //             break;
    //         case 2:
    //             result = this._runeInfo.baseProperties['agility'];
    //             break;
    //         case 3:
    //             result = this._runeInfo.baseProperties['intel'];
    //             break;
    //         case 4:
    //             result = this._runeInfo.baseProperties['physi'];
    //             break;
    //         case 5:
    //             result = this._runeInfo.baseProperties['captain'];
    //             break;
    //         case 6:
    //             result = this._runeInfo.baseProperties['attack'];
    //             break;
    //         case 7:
    //             result = this._runeInfo.baseProperties['defence'];
    //             break;
    //         case 8:
    //             result = this._runeInfo.baseProperties['magicattack'];
    //             break;
    //         case 9:
    //             result = this._runeInfo.baseProperties['magicdefence'];
    //             break;
    //         case 10:
    //             result = this._runeInfo.baseProperties['live'];
    //             break;
    //         case 11:
    //             result = this._runeInfo.baseProperties['conat'];
    //             break;
        
    //         default:
    //             break;
    //     }
    //     return result;
    // }

    private totalLevel:number=0;

    /**
     * 获得已镶嵌符石的总等级
     */
    getInayedGemTotalLevel(){
        this.totalLevel = 0;
        let runeType= this._runeInfo.templateInfo.RuneType
        let bagData = GoodsManager.Instance.getGoodsByBagType(BagType.RUNE_EQUIP);
        if(bagData.length > 0){
            for (let i = 0; i < bagData.length; i++) {
                const goodsInfo = bagData[i];  
                let index = goodsInfo.pos - (runeType -1) * 10
                if(index >= 0 && index <= 4){
                    this.totalLevel += goodsInfo.strengthenGrade;
                }
            }
        }
    }


    /**
     * 显示符孔的符石效果
     * @param holeCfg 
     */
    getSkillEffDesc(effNum:number,holeData:t_s_runeholeData,Condition:number,ConditionParam:number,RuneType:string):string{
        let str:string='';
        let isActive = false;
        //判断激活条件-----------------------------------------------------------------------------------------
        if(Condition == 99){
            str += LangManager.Instance.GetTranslation('runeGem.str25',ConditionParam);
            isActive = this.totalLevel >= ConditionParam;
        }else{
            let attriKey = SkillWndData.getAttributeType(Condition);
            str += LangManager.Instance.GetTranslation('runeGem.str35',attriKey,ConditionParam);////激活条件参数ConditionParam1
            isActive = this.checkIsActive(Condition,ConditionParam);
        }
        // if(!isActive){
            str = effNum+ '.'+ LangManager.Instance.GetTranslation('runeGem.str31')+ str;
        // }else{
        //     str= effNum+ '.'+str;
        // }
       
        //---------------------------------------------------------------------------------------------------
      
        //决定该技能生效的符文
        if(RuneType != '0'){
            // let tempStr:string='';
            // let arr = RuneType.split(',');
            // for (let i = 0; i < arr.length; i++) {
                // const element = Number(arr[i]);
                // let info:t_s_runetemplateData = TempleteManager.Instance.getRuneTemplateInfoByRuneType(element);
                // if(info){
                //     if(i <= arr.length-1){
                //         tempStr += LangManager.Instance.GetTranslation('runeGem.str29',info.TemplateName);
                //     }
                // }
            // }
            // str += tempStr;

            let type = this._runeType.toString();
            let typeArr = RuneType.split(',')
            if(typeArr.indexOf(type) == -1){
                isActive = false;
            }else
            {
                isActive = isActive && true;
            }
        }
      
        str += '；' +LangManager.Instance.GetTranslation('runeGem.str32') + holeData.DescriptionLang;
        if(!isActive){
            str = '[color=#666666]' + str + '[/color]';
        }
        return str;
    }

    /**
     * 某种属性符石的等级
     * @param attriType 
     * @param val 
     * @returns 
     */
    checkIsActive(attriType:number,val:number):boolean{
        if(!this._runeInfo.baseProperties) return false;
        let result:boolean=false;
        let level = 0;
        let runeType= this._runeInfo.templateInfo.RuneType
        let bagData = GoodsManager.Instance.getGoodsByBagType(BagType.RUNE_EQUIP);
        if(bagData.length > 0){
            for (let i = 0; i < bagData.length; i++) {
                const goodsInfo = bagData[i];  
                let index = goodsInfo.pos - (runeType -1) * 10
                if(index >= 0 && index <= 4){
                    if(Number(goodsInfo.templateInfo.Property1) == attriType){
                        level += goodsInfo.strengthenGrade;
                    } 
                   
                }
            }
        }
        result = level >= val;
        return result;
    }

    onBuy(){

    }

    onResolve(){

    }

    dispose(): void {
        super.dispose();
    }
}