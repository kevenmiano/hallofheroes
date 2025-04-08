import AudioManager from "../../../core/audio/AudioManager";
import { BattleType } from "../../constant/BattleDefine";
import { BattleEvent } from "../../constant/event/NotificationEvent";
import { SoundIds } from '../../constant/SoundIds';
import { NotificationManager } from "../../manager/NotificationManager";
import { SharedManager } from "../../manager/SharedManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { BattleManager } from "../BattleManager";
import { BattleModel } from "../BattleModel";

/**
 * 战斗背景音乐控制器
 * @author yuanzhan.yu
 */
export class BattleMapSoundControl {

    public static mapMusicRecord: Map<number, any> = new Map();

    private static maxBattleMusicCount: number = 9;

    constructor() {
    }

    public start() {
        this.playMapMusic();
        this.addHandler();
    }

    private addHandler() {
        // NotificationManager.Instance.addEventListener(BattleEvent.BATTLE_MUSIC_ON_OFF, this.onBattleMusicOnOff, this);
    }

    /**
     * 开关地图音乐
     * @param event
     *
     */
    private onBattleMusicOnOff(event: BattleEvent) {
        if (SharedManager.Instance.allowMusic) {
            this.playMapMusic();
        } else {
            AudioManager.Instance.stopMusic();
        }
    }

    /**
     * 播放地图音乐
     */
    private playMapMusic() {
        var randomIndex: number = 0;
        AudioManager.Instance.stopMusic();
        var battleModel: BattleModel = BattleManager.Instance.battleModel
        var mapBattleGround: number;
        if (battleModel.battleType == BattleType.WORLD_BOSS_BATTLE) {
            mapBattleGround = 0;
        } else if (battleModel.isBossBattle()) {
            mapBattleGround = 1;
        } else {
            let mapData = TempleteManager.Instance.getMapTemplatesByID(battleModel.mapId);
            if (mapData)
                mapBattleGround = mapData.BattleGround + 1;
        }
        randomIndex = this.getMusicIndex(SoundIds.BattleMapMusics, mapBattleGround)//Math.floor(Math.random()*musics.length);
        if (randomIndex <= 0)
            randomIndex = 0;
        AudioManager.Instance.playMusic(SoundIds.BattleMapMusics[randomIndex], 0);
    }

    /**
     * 取得音乐序号
     * @param musics
     * @param groundId
     * @return
     */
    private getMusicIndex(musics: string[], groundId: number): number {
        if (BattleMapSoundControl.mapMusicRecord[groundId] == undefined) {
            BattleMapSoundControl.mapMusicRecord[groundId] = 0;
            return 0;
        }
        var idx: number = BattleMapSoundControl.mapMusicRecord[groundId];
        idx++;
        if(idx > musics.length - 1){
            idx = 0
        }
        BattleMapSoundControl.mapMusicRecord[groundId] = idx;
        return idx;
    }

    public dispose() {
    }
}

