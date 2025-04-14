/**
 * @author:pzlricky
 * @data: 2020-11-24 20:47
 * @description ***
 */
export default class Dictionary {
  has(key: any): boolean {
    return this.hasOwnProperty(key);
  }

  set(key: any, val: any) {
    this[key] = val;
  }

  get length(): number {
    let count = 0;
    for (let k in this) {
      if (k == "__dispatcher" || k == "__list") continue;
      count++;
    }
    return count;
  }

  delete(key: any): boolean {
    if (this.has(key)) {
      delete this[key];
      return true;
    }
    return false;
  }

  get(key: any): any {
    return this.has(key) ? this[key] : undefined;
  }

  get values(): any[] {
    let values: any[] = [];
    for (let k in this) {
      if (this.has(k)) {
        if (k == "__dispatcher" || k == "__list") continue;
        values.push(this[k]);
      }
    }
    return values;
  }

  forEach(func: Function) {
    for (let k in this) {
      if (this.has(k)) {
        if (k == "__dispatcher" || k == "__list") continue;
        func(this[k], k);
      }
    }
  }
}
