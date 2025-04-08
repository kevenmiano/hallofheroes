import { BattleEvent } from "../../game/constant/event/NotificationEvent";
import { NotificationManager } from "../../game/manager/NotificationManager";
import { SharedManager } from "../../game/manager/SharedManager";
import GameEventDispatcher from "../event/GameEventDispatcher";
// import IManager from '../Interface/IManager';
import Logger from "../logger/Logger";
import MusicManager from "./MusicManager";
import SoundEftManager from "./SoundEftManager";
export default class AudioManager
  extends GameEventDispatcher
  implements IManager
{
  private static MusicFailedTryTime: number = 3;
  private static WORLDBOSSMUSIC: string = "BattleMusicBoss";
  private static BOSSMUSIC: string = "BattleMusicWorldBoss";
  private static BATTLEMUSIC: string = "BattleMusic";
  private static MAP_NUM: number = 11;

  //====================================== 背景音乐====================================

  private _currentState: string;
  private soundResMap: Map<string, string> = new Map();

  protected musicMgr: MusicManager;
  protected soundMgr: SoundEftManager;

  private static ins: AudioManager;
  static get Instance(): AudioManager {
    if (!AudioManager.ins) {
      AudioManager.ins = new AudioManager();
    }
    return AudioManager.ins;
  }

  constructor() {
    super();
    this.musicMgr = new MusicManager();
    this.soundMgr = new SoundEftManager();
    Laya.SoundManager.autoStopMusic = false;
    Laya.SoundManager.useAudioMusic = false;
    NotificationManager.Instance.addEventListener(
      BattleEvent.BATTLE_MUSIC_ON_OFF,
      this.onBattleMusicOnOff,
      this
    );
    Laya.stage.on(Laya.Event.VISIBILITY_CHANGE, this, () => {
      if (Laya.stage.isVisibility) {
        this.eventShow();
      } else {
        this.eventHide();
      }
    });
  }

  /**
   * 开关地图音乐
   * @param event
   *
   */
  private onBattleMusicOnOff(event: BattleEvent) {
    if (SharedManager.Instance.allowMusic) {
      this.resumeMusic();
    } else {
      this.pauseMusic();
    }
  }

  preSetup(t?: any) {
    this.init();
  }

  setup(t?: any) {
    this.init();
  }

  init() {
    this._allowMusic = SharedManager.Instance.allowMusic;
    this._allowSound = SharedManager.Instance.allowSound;
    this.musicVolume = SharedManager.Instance.musicVolumn / 100;
    this.soundVolume = SharedManager.Instance.soundVolumn / 100;
    Laya.stage.on(Laya.Event.BLUR, this, this.eventHide);
    Laya.stage.on(Laya.Event.FOCUS, this, this.eventShow);
  }

  private _musicVolumn: number = 1;
  public set musicVolume(value: number) {
    this._musicVolumn = value;
    this.musicMgr.setVolume(value);
  }

  public get musicVolume(): number {
    return this._musicVolumn;
  }

  private _soundVolume: number = 1;
  public set soundVolume(value: number) {
    this._soundVolume = value;
    this.soundMgr.setVolume(value);
  }

  public get soundVolume(): number {
    return this._soundVolume;
  }

  private _allowSound: boolean = false;
  public get allowSound(): boolean {
    return this._allowSound;
  }
  public set allowSound(value: boolean) {
    if (this._allowSound == value) return;
    this._allowSound = value;
    //不用理会真在播放的音效, 更不需要重置
    if (this._allowSound == false) {
      this.stopAllSound();
    } else {
      this.resumeAllSound();
    }
  }

  private _allowMusic: boolean = false;
  public get allowMusic(): boolean {
    return this._allowMusic;
  }
  public set allowMusic(value: boolean) {
    if (this._allowMusic == value) return;
    this._allowMusic = value;
    if (this._allowMusic == false) {
      this.stopMusic();
    } else {
      this.playMusic(this._musicUrl);
    }
  }

  /**
   * 切到后台
   */
  eventHide() {
    Logger.info("切到后台");
    // Laya.SoundManager.musicMuted = true;
    // this.pauseMusic();
  }

  /**
   * 切回前台
   */
  eventShow() {
    Logger.info("切到前台");
    // Laya.SoundManager.musicMuted = false;
    // this.resumeMusic();
  }

  /**
   * 播放音乐
   * @param name
   * @param loops
   */
  private _musicUrl: string = "";
  playMusic(name: string, loops: number = 0) {
    Logger.info("MusicManager playMusic", this._allowMusic, name);
    this._musicUrl = name;
    if (!this._allowMusic) {
      return;
    }
    // if(this._musicUrl == name) {
    //     return;
    // }
    this.musicMgr.stop();
    this.musicMgr.play(name);
  }

  //停止音乐
  stopMusic() {
    try {
      if (!this.musicMgr.isPlaying()) {
        return;
      }
      this.musicMgr.stop();
    } catch (error) {
      Logger.error(error.message);
    }
  }

  //暂停音乐
  pauseMusic() {
    try {
      this.musicMgr.pause();
    } catch (error) {
      Logger.error(error.message);
    }
  }

  //恢复音乐
  resumeMusic() {
    try {
      this.musicMgr.resume();
    } catch (error) {
      Logger.error(error.message);
    }
  }

  /**
   * 播放普通界面等音效音效
   * @param name
   * @param loops
   * @return SoundChannel
   */
  playSound(name: string, loops: number = 1): Laya.SoundChannel {
    if (!this._allowSound) return;
    return this.soundMgr.play(name, loops);
  }

  //停止某个音效
  stopSound(name: string) {
    this.soundMgr.stop(name);
  }

  //暂停某个音效
  pauseSound(name: string) {
    this.soundMgr.pause(name);
  }

  //恢复某个音效
  resumeSound(name: string) {
    this.soundMgr.resume(name);
  }

  //停止所有音效
  stopAllSound() {
    this.soundMgr.stopAll();
  }

  //暂停所有音效
  pauseAllSound() {
    this.soundMgr.pauseAll();
  }

  //恢复所有音效
  resumeAllSound() {
    this.soundMgr.resumeAll();
  }
}
