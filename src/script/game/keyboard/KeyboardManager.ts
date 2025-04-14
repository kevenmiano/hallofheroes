import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import Logger from "../../core/logger/Logger";
import KeyMap from "./KeyMap";
import KeyStroke from "./KeyStroke";
/*
 Copyright aswing.org, see the LICENCE.txt.
*/

/**
 * KeyboardController controlls the key map for the action firing.
 * <p>
 * Thanks Romain for his Fever{@link http://fever.riaforge.org} accelerator framworks implementation,
 * this is a simpler implementation study from his.
 *
 * @see org.aswing.KeyMap
 * @see org.aswing.KeyType
 * @author iiley
 */
export default class KeyboardManager extends GameEventDispatcher {
  private static instance: KeyboardManager;

  private keymaps: Array<any>;
  private keySequence: Array<any>;
  private selfKeyMap: KeyMap;
  private inited: boolean;
  private keyJustActed: boolean;

  private mnemonicModifier: Array<number>;

  /**
   * Singleton class,
   * Don't create instance directly, in stead you should call <code>getInstance()</code>.
   */
  public constructor() {
    super();
    this.inited = false;
    this.keyJustActed = false;
    this.keymaps = [];
    this.keySequence = [];
    this.selfKeyMap = new KeyMap();
    this.mnemonicModifier = [Laya.Keyboard.CONTROL, Laya.Keyboard.SHIFT];
    this.registerKeyMap(this.selfKeyMap);
  }

  /**
   * Returns the global keyboard controller.
   */
  public static get Instance(): KeyboardManager {
    if (KeyboardManager.instance == null) {
      KeyboardManager.instance = new KeyboardManager();
    }
    return KeyboardManager.instance;
  }

  /**
   * Init the keyboad manager, it will only start works when it is inited.
   * By default, it will be inited when a component is added to stage automatically.
   */
  public init(stage: Laya.Stage) {
    if (!this.inited) {
      this.inited = true;
      stage.on(Laya.Event.KEY_DOWN, this, this.__onKeyDown);
      stage.on(Laya.Event.KEY_UP, this, this.__onKeyUp);
      // stage.on(Laya.Event.DEACTIVATE, this, this.__deactived);

      //stage.on(Laya.Event.KEY_DOWN, __onKeyDownCap, true);
      //stage.on(Laya.Event.KEY_UP, __onKeyUpCap, true);
    }
  }

  /**
   * Registers a key action map to the controller
   */
  public registerKeyMap(keyMap: KeyMap) {
    if (!this.keymaps.includes(keyMap)) {
      this.keymaps.push(keyMap);
    }
  }

  /**
   * Unregisters a key action map to the controller
   * @param keyMap the key map
   */
  public unregisterKeyMap(keyMap: KeyMap) {
    let index = this.keymaps.indexOf(keyMap);
    if (index >= 0) this.keymaps.splice(index, 1);
  }

  /**
   * Registers a key action to the default key map of this controller.
   * @param key the key type
   * @param action the action
   * @see KeyMap#registerKeyAction()
   */
  public registerKeyAction(key: KeyStroke, action: Function) {
    this.selfKeyMap.registerKeyAction(key, action);
  }

  /**
   * Unregisters a key action to the default key map of this controller.
   * @param key the key type
   * @see KeyMap#unregisterKeyAction()
   */
  public unregisterKeyAction(key: KeyStroke, action: Function) {
    this.selfKeyMap.unregisterKeyAction(key, action);
  }

  /**
   * Returns whether or not the key is down.
   * @param the key code
   * @return true if the specified key is down, false if not.
   */
  public isKeyDown(keyCode: number): boolean {
    return this.keySequence.includes(keyCode);
  }

  /**
   * Returns whether or not the key is down.
   * This method is same to <code>getInstance().isKeyDown()</code>
   * @param the key code
   * @return true if the specified key is down, false if not.
   */
  public static isDown(keyCode: number): boolean {
    return KeyboardManager.Instance.isKeyDown(keyCode);
  }

  /**
   * Sets the mnemonic modifier key codes, the default is [Ctrl, Shift], however
   * for normal UI frameworks, it is [Alt], but because the flashplayer or explorer will
   * eat [Alt] for thier own mnemonic modifier, so we set our default to [Ctrl, Shift].
   * @param keyCodes the array of key codes to be the mnemoic modifier.
   */
  public setMnemonicModifier(keyCodes: Array<any>) {
    this.mnemonicModifier = keyCodes.concat();
  }

  /**
   * Returns whether or not the mnemonic modifier keys is down.
   * @return whether or not the mnemonic modifier keys is down.
   */
  public isMnemonicModifierDown(): boolean {
    for (var i: number = 0; i < this.mnemonicModifier.length; i++) {
      if (!this.isKeyDown(this.mnemonicModifier[i])) {
        return false;
      }
    }
    return this.mnemonicModifier.length > 0;
  }

  /**
   * Returns whether or not just a key action acted when the last key down.
   * @return true if there's key actions acted at last key down, false not.
   */
  public isKeyJustActed(): boolean {
    return this.keyJustActed;
  }

  private __onKeyDown(e: Laya.Event) {
    this.dispatchEvent(Laya.Event.KEY_DOWN, e);
    var code: number = e.keyCode;
    //忽略掉不可以见的按键组合
    if (!this.keySequence.includes(code) && code < 139) {
      this.keySequence.push(code);
    }
    Logger.log(this.keySequence.toString());
    this.keyJustActed = false;
    var n: number = this.keymaps.length;
    for (var i: number = 0; i < n; i++) {
      var keymap: KeyMap = this.keymaps[i];
      if (keymap.fireKeyAction(this.keySequence)) {
        this.keyJustActed = true;
      }
    }
  }

  private __onKeyUp(e: Laya.Event) {
    this.dispatchEvent(Laya.Event.KEY_UP, e);
    var code: number = e.keyCode;
    let index = this.keySequence.indexOf(code);
    if (index >= 0) this.keySequence.splice(index, 1);
    //avoid IME bug that can't trigger keyup event when active IME and key up
    if (!e.ctrlKey) {
      let index = this.keySequence.indexOf(Laya.Keyboard.CONTROL);
      if (index >= 0) this.keySequence.splice(index, 1);
    }
    if (!e.shiftKey) {
      let index = this.keySequence.indexOf(Laya.Keyboard.SHIFT);
      if (index >= 0) this.keySequence.splice(index, 1);
    }
  }

  private __deactived(e: Event) {
    this.keySequence = [];
  }

  public reset() {
    this.keySequence = [];
  }
}
