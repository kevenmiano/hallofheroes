import Logger from "../logger/Logger";
import TSMap from "../struct/TSMap";
import BaseAudioManager from "./BaseAudioManager";

export default class SoundManager extends BaseAudioManager {
  private soundChannelMap: TSMap<string, Laya.SoundChannel> = new TSMap();
  private static _instance: SoundManager;
  public static get Instance(): SoundManager {
    if (!SoundManager._instance) SoundManager._instance = new SoundManager();
    return SoundManager._instance;
  }

  /**
   * 播放音效 这里针对播放同一个音效存使用同一个key
   * @param name 资源名称
   * @param loops 播放次数,  0 循环播放
   */
  play(name: string, loops: number = 1): Laya.SoundChannel {
    let channel: Laya.SoundChannel;
    channel = Laya.SoundManager.playSound(name, loops);
    this.soundChannelMap.set(name, channel);
    return channel;
  }

  getMaxNum() {
    return 20;
  }

  pause(name: string) {
    try {
      if (this.soundChannelMap.get(name)) {
        this.soundChannelMap.get(name).pause();
      }
    } catch (error) {
      Logger.error("error:", error.message);
    }
  }

  resume(name: string) {
    try {
      if (this.soundChannelMap.get(name)) {
        this.soundChannelMap.get(name).resume();
      }
    } catch (error) {
      Logger.error("error:", error.message);
    }
  }

  stop(name: string) {
    try {
      if (this.soundChannelMap.get(name)) {
        this.soundChannelMap.get(name).stop();
      }
      this.soundChannelMap.remove(name);
    } catch (error) {
      Logger.error("error:", error.message);
    }
  }

  pauseAll() {
    this.soundChannelMap.forEach((key, value) => {
      this.pause(key);
    });
  }

  resumeAll() {
    this.soundChannelMap.forEach((key, value) => {
      this.resume(key);
    });
  }

  stopAll() {
    this.soundChannelMap.forEach((key, value) => {
      this.stop(key);
    });
    this.soundChannelMap.clear();
  }

  isPlaying() {
    return false;
  }

  setVolume(count: number) {
    Laya.SoundManager.setSoundVolume(count);
  }

  clear() {
    this.stopAll();
  }

  /**
   * 播放背景音乐
   * @param state
   * @param index
   * @param loops
   * @param replaceSame
   */
  public playMusic(
    state: string,
    loops: number = 0,
    replaceSame: boolean = false,
  ) {
    this.play(state, loops);
  }

  stopMusic() {}
}
