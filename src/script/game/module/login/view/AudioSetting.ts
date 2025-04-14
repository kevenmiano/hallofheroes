import FUI_AudioSetting from "../../../../../fui/Login/FUI_AudioSetting";
import AudioManager from "../../../../core/audio/AudioManager";
import { SoundIds } from "../../../constant/SoundIds";
import { BaseManager } from "../../../manager/BaseManager";
import { SharedManager } from "../../../manager/SharedManager";

/**
 * 音效设置
 */
export class AudioSetting extends FUI_AudioSetting {
  onInit() {
    this.offEvent();
    this.addEvent();
    this.onInitData();
  }

  private addEvent() {
    this.musicCheckbox.onClick(this, this.onMusic);
    this.effectCheckbox.onClick(this, this.onSound);
    this.musicProgress.on(fairygui.Events.STATE_CHANGED, this, this.onMusicPro);
    this.effectProgress.on(
      fairygui.Events.STATE_CHANGED,
      this,
      this.onSoundPro,
    );
  }

  private onMusic() {
    this.playSound();
    BaseManager.isMusicOn = this.musicCheckbox.selected;
    SharedManager.Instance.allowMusic = this.musicCheckbox.selected;
    AudioManager.Instance.allowMusic = this.musicCheckbox.selected;
    SharedManager.Instance.save();
    this.musicProgress.enabled = this.musicCheckbox.selected;
  }

  private onSound() {
    this.playSound();
    BaseManager.isSoundOn = this.effectCheckbox.selected;
    SharedManager.Instance.allowSound = this.effectCheckbox.selected;
    AudioManager.Instance.allowSound = this.effectCheckbox.selected;
    SharedManager.Instance.save();
    this.effectProgress.enabled = this.effectCheckbox.selected;
  }

  private onMusicPro() {
    let val = Number(this.musicProgress.value);
    SharedManager.Instance.musicVolumn = val;
    AudioManager.Instance.musicVolume = val / 100;
    this.music_value_txt.text = val.toFixed(0) + "%";
    SharedManager.Instance.save();
  }

  private onSoundPro() {
    let val = Number(this.effectProgress.value);
    SharedManager.Instance.soundVolumn = val;
    AudioManager.Instance.soundVolume = val / 100;
    this.effect_value_txt.text = val.toFixed(0) + "%";
    SharedManager.Instance.save();
  }

  private offEvent() {
    this.musicCheckbox && this.musicCheckbox.offClick(this, this.onMusic);
    this.effectCheckbox && this.effectCheckbox.offClick(this, this.onSound);
    this.musicProgress &&
      this.musicProgress.off(
        fairygui.Events.STATE_CHANGED,
        this,
        this.onMusicPro,
      );
    this.effectProgress &&
      this.effectProgress.off(
        fairygui.Events.STATE_CHANGED,
        this,
        this.onSoundPro,
      );
  }

  private onInitData() {
    this.musicProgress.min = 0;
    this.musicProgress.max = 100;
    this.effectProgress.min = 0;
    this.effectProgress.max = 100;

    this.musicCheckbox.selected = SharedManager.Instance.allowMusic;
    this.effectCheckbox.selected = SharedManager.Instance.allowSound;
    this.musicProgress.value = SharedManager.Instance.musicVolumn;
    this.effectProgress.value = SharedManager.Instance.soundVolumn;

    this.musicProgress.enabled = this.musicCheckbox.selected;
    this.effectProgress.enabled = this.effectCheckbox.selected;

    this.music_value_txt.text = this.musicProgress.value.toFixed(0) + "%";
    this.effect_value_txt.text = this.effectProgress.value.toFixed(0) + "%";
  }

  private playSound() {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
  }

  dispose() {
    this.offEvent();
    super.dispose();
  }
}
