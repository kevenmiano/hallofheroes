// TODO FIX
/**
 * @author:pzlricky
 * @data: 2022-03-23 11:50
 * @description Crypto加密解密
 */
export default class CryptoUtils {
  public static CRYPTO_KEY: string = "c1VBY7dOJy6axeoK";
  constructor() {}

  //DES加密
  public static encryptByDES(message, key?: string) {
    if (!key) {
      key = this.CRYPTO_KEY;
    }
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString();
  }

  //DES解密
  public static decryptByDES(ciphertext, key?: string) {
    if (!key) {
      key = this.CRYPTO_KEY;
    }
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var decrypted = CryptoJS.DES.decrypt(
      {
        ciphertext: CryptoJS.enc.Hex.parse(ciphertext),
      },
      keyHex,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    var result_value = decrypted.toString(CryptoJS.enc.Utf8);
    return result_value;
  }
}
