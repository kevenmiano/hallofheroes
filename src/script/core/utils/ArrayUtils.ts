export class ArrayConstant {
  static CASEINSENSITIVE: number = 1;
  static DESCENDING: number = 2;
  static UNIQUESORT: number = 4;
  static RETURNINDEXEDARRAY: number = 8;
  static NUMERIC: number = 16;
}

export class ArrayUtils {
  /**
   * Call the operation by pass each element of the array once.
   * <p>
   * for example:any <pre>
   * //hide all component in vector components
   * ArrayUtils.each(
   *     components,
   *     function(c:Component){
   *         c.setVisible(false);
   *     });
   * <pre>
   * @param arr the array for each element will be operated.
   * @param the operation function for each element
   * @see Vector#each
   */
  public static each(arr: any[], operation: Function) {
    for (let i: number = 0; i < arr.length; i++) {
      operation(arr[i]);
    }
  }

  /**
   * Sets the size of the array. If the new size is greater than the current size,
   * new undefined items are added to the end of the array. If the new size is less than
   * the current size, all components at index newSize and greater are removed.
   * @param arr the array to resize
   * @param size the new size of this vector
   */
  public static setSize(arr: any[], size: number) {
    //TODO test this method
    if (size < 0) {
      size = 0;
    }
    if (size == arr.length) {
      return;
    }
    if (size > arr.length) {
      arr[size - 1] = undefined;
    } else {
      arr.splice(size);
    }
  }

  /**
   * Removes the object from the array and return the index.
   * @return the index of the object, -1 if the object is not in the array
   */
  public static removeFromArray(arr: any[], obj: object): number {
    for (let i: number = 0; i < arr.length; i++) {
      if (arr[i] == obj) {
        arr.splice(i, 1);
        return i;
      }
    }
    return -1;
  }

  public static removeAllFromArray(arr: any[], obj: object) {
    for (let i: number = 0; i < arr.length; i++) {
      if (arr[i] == obj) {
        arr.splice(i, 1);
        i--;
      }
    }
  }

  public static removeAllBehindSomeIndex(array: any[], index: number) {
    if (index <= 0) {
      array.splice(0, array.length);
      return;
    }
    let arrLen: number = array.length;
    for (let i: number = index + 1; i < arrLen; i++) {
      array.pop();
    }
  }

  public static indexInArray(arr: any[], obj: object): number {
    for (let i: number = 0; i < arr.length; i++) {
      if (arr[i] == obj) {
        return i;
      }
    }
    return -1;
  }

  public static cloneArray(arr: any[]): any[] {
    return arr.concat();
  }

  public static dup_fn(array: Array<any>, field, field_options): any {
    let filtered =
      field_options & ArrayConstant.NUMERIC
        ? array.map(function (item) {
            return item[field].toFloat();
          })
        : field_options & ArrayConstant.CASEINSENSITIVE
          ? array.map(function (item) {
              return item[field].toLowerCase();
            })
          : array.map(function (item) {
              return item[field];
            });

    return filtered.length !== ArrayUtils.combine([], filtered).length;
  }

  public static sort_fn(item_a, item_b, fields, options): any {
    return (function sort_by(fields, options) {
      let ret,
        a,
        b,
        opts = options[0],
        sub_fields = fields[0].match(/[^.]+/g);

      (function get_values(s_fields, s_a, s_b) {
        let field = s_fields[0];
        if (s_fields.length > 1) {
          get_values(s_fields.slice(1), s_a[field], s_b[field]);
        } else {
          a = s_a[field];
          b = s_b[field];
        }
      })(sub_fields, item_a, item_b);

      if (opts & ArrayConstant.NUMERIC) {
        ret = parseFloat(a) - parseFloat(b);
      } else {
        if (opts & ArrayConstant.CASEINSENSITIVE) {
          a = a.toLowerCase();
          b = b.toLowerCase();
        }
        ret = a > b ? 1 : a < b ? -1 : 0;
      }

      if (ret === 0 && fields.length > 1) {
        ret = sort_by(fields.slice(1), options.slice(1));
      } else if (opts & ArrayConstant.DESCENDING) {
        ret *= -1;
      }

      return ret;
    })(fields, options);
  }

  public static combine(array: Array<any>, c): Array<any> {
    for (let b = 0, a = c.length; b < a; b++) {
      ArrayUtils.include(array, c[b]);
    }
    return array;
  }

  public static include(array: Array<any>, a): Array<any> {
    if (!ArrayUtils.contains(array, a)) {
      array.push(a);
    }
    return array;
  }

  public static contains(array: Array<any>, obj): boolean {
    let i = array.length;
    while (i--) {
      if (array[i] === obj) {
        return true;
      }
    }
    return false;
  }

  public static sortOn(array, fields, options) {
    fields = Array.isArray(fields) ? fields : [fields];
    options = Array.isArray(options) ? options : [options];

    if (options.length !== fields.length) {
      options = [];
    }

    if (
      options[0] & ArrayConstant.UNIQUESORT &&
      fields.some(function (field, i) {
        return ArrayUtils.dup_fn(array, field, options[i]);
      })
    ) {
      return 0;
    }

    let curry_sort = function (item_a, item_b) {
      return ArrayUtils.sort_fn(item_a, item_b, fields, options);
    };

    if (options[0] && ArrayConstant.RETURNINDEXEDARRAY) {
      return array.slice().sort(curry_sort);
    } else {
      return array.sort(curry_sort);
    }
  }

  public static unique(arr, u_key) {
    let map = new Map();
    arr.forEach((item, index) => {
      if (!map.has(item[u_key])) {
        map.set(item[u_key], item);
      }
    });
    return [...map.values()];
  }

  public static arrayNonRepeatfy(arr) {
    let map = new Map();
    let array = []; // 数组用于返回结果
    for (let i = 0; i < arr.length; i++) {
      if (map.has(arr[i])) {
        // 如果有该key值
        map.set(arr[i], true);
      } else {
        map.set(arr[i], false); // 如果没有该key值
        array.push(arr[i]);
      }
    }
    return array;
  }

  /**
   * 随机数组顺序
   * @param array
   * @returns
   */
  public static shuffle<T>(array: T[]): T[] {
    const shuffledArray: T[] = [...array];

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }

    return shuffledArray;
  }
}
