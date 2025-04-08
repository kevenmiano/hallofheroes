import Logger from "../../core/logger/Logger";
import Dictionary from "../../core/utils/Dictionary";
import KeyStroke from "./KeyStroke";

/**
* @author:pzlricky
* @data: 2021-06-21 17:02
* @description *** 
*/
export default class KeyMap {

    private map: Dictionary;

    constructor()
    {
        this.map = new Dictionary();
    }

    /**
     * Registers a key definition -> action pair to the map. If same key definition is already 
     * in the map, it will be replaced with the new one.
     * @param key the key definition.
     * @param action the aciton
     */
    public registerKeyAction(key: KeyStroke, action: Function) {
        var codec: string = KeyMap.getCodec(key);
        var list: Array<any> = this.map[codec];
        if (list == null)
            list = new Array();
        list.push(new KeyAction(key, action));
        this.map[codec] = list;
    }

    /**
     * Unregisters a key and its action value.
     * @param key the key and its value to be unrigesterd.
     */
    public unregisterKeyAction(key: KeyStroke, action: Function) {
        var codec: string = KeyMap.getCodec(key);
        var list: Array<any> = this.map[codec];
        if (list) {
            for (var i: number = 0; i < list.length; i++) {
                var ka: KeyAction = list[i];
                if (ka.action == action) {
                    list.splice(i, 1);
                    i--;
                }
            }
        }
    }

    /**
     * Returns the action from the key defintion.
     * @param key the key definition
     * @return the action.
     * @see #getCodec()
     */
    public getKeyAction(key: KeyStroke): Function {
        return this.getKeyActionWithCodec(KeyMap.getCodec(key));
    }

    private getKeyActionWithCodec(codec: string): Function {
        var list: Array<any> = this.map[codec];
        if (list != null && list.length > 0) {
            return list[list.length - 1].action;
        }
        return null;
    }

    /**
     * Fires a key action with key sequence.
     * @return whether or not a key action fired with this key sequence.
     */
    public fireKeyAction(keySequence: Array<any>): boolean {
        var codec: string = KeyMap.getCodecWithKeySequence(keySequence);
        Logger.log("codec : " + codec);
        var action: Function = this.getKeyActionWithCodec(codec);
        if (action != null) {
            action();
            return true;
        }
        return false;
    }

    /**
     * Returns whether the key definition is already registered.
     * @param key the key definition
     */
    public containsKey(key: KeyStroke): boolean {
        return this.map[KeyMap.getCodec(key)] != null;
    }

    /**
     * Returns the codec of a key definition, same codec means same key definitions.
     * @param key the key definition
     * @return the codec of specified key definition
     */
    public static getCodec(key: KeyStroke): string {
        //@ts-ignore
        return KeyMap.getCodecWithKeySequence(key.getCodeSequence());
    }

    /**
     * Returns the codec of a key sequence.
     * @param keySequence the key sequence
     * @return the codec of specified key sequence
     */
    public static getCodecWithKeySequence(keySequence: Array<any>): string {
        return keySequence.join("|");
    }

}

export class KeyAction {
    key: KeyStroke;
    action: Function;

    constructor(key: KeyStroke, action: Function) {
        this.key = key;
        this.action = action;
    }
}