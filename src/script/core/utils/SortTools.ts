export enum ArraySort {
  UPPER = 1,
  LOWER = 0,
}
export default class SortTools {
  public constructor() {}

  /**
     * 多条件排序支持混排
     * @param tbl 要排序的table
     * @param argName 要比较的表项中的多个key,
     * @param argType 跟key对应的排序方式（升序:ArraySort.UPPER还是降序:ArraySort.LOWER）
     * @传参格式: arg = [key1,key2,...],[ArraySort.UPPER,ArraySort.LOWER,...]}
        不填写排序方式默认为升序ArraySort.UPPER
        * @constructor
        */
  public static MoreKeysSorter(
    tbl: Array<any>,
    argName: Array<string>,
    argType: Array<ArraySort>,
  ) {
    //var a = {name : "a",a:6,b:7,c:5};
    //var b = {name : "b",a:9,b:8,c:3};
    //var c = {name : "c",a:9,b:7,c:3};
    //var d = {name : "d",a:6,b:7,c:3};
    //var e = {name : "e",a:6,b:7,c:5};
    //var test = [a,b,c,d,e];
    //argName = ['a','b','c'];
    //argType = [ArraySort.UPPER,ArraySort.LOWER,ArraySort.LOWER]

    var index = 0;
    var func = function (a, b) {
      var sortKey = argName[index];
      var sortType = <ArraySort>argType[index];
      if (a[sortKey] == b[sortKey]) {
        index = index + 1;
        if (index > argName.length) {
          index = 0;
          return 0;
        } else {
          return func(a, b);
        }
      } else {
        index = 0;
        if (sortType == ArraySort.UPPER) {
          return a[sortKey] - b[sortKey];
        } else {
          return b[sortKey] - a[sortKey];
        }
      }
    };

    tbl.sort(func);

    //test.sort(func);
    //
    //debug("test",test);
  }

  /**
   * 排序 [{age:11}, {age:12}]
   * arr : 要排序的数组
   * key : 排序的key 比如 age
   * asc : 是否升序
   */
  public static sortMap(arr: Array<any>, key: string, asc: boolean = true) {
    if (!arr) {
      return;
    }
    arr.sort(function (a, b) {
      if (asc) {
        return a[key] - b[key];
      } else {
        return b[key] - a[key];
      }
    });
  }

  /**
   * 排序 [{age:11,stature:{cm:100}}, {age:12,stature:{cm:90}}]
   * arr : 要排序的数组
   * param: 排序的key 比如stature.cm;  sortMap1(arr, false, "stature","cm")
   * asc : 是否升序
   */
  public static sortMap1(arr: Array<any>, asc: boolean, ...param: any[]) {
    arr.sort(function (a, b) {
      if (asc) {
        if (param.length == 1) return a[param[0]] - b[param[0]];
        else if (param.length == 2)
          return a[param[0]][param[1]] - b[param[0]][param[1]];
        else if (param.length == 3)
          return (
            a[param[0]][param[1]][param[2]] - b[param[0]][param[1]][param[2]]
          );
      } else {
        if (param.length == 1) return b[param[0]] - a[param[0]];
        else if (param.length == 2)
          return b[param[0]][param[1]] - a[param[0]][param[1]];
        else if (param.length == 3)
          return (
            b[param[0]][param[1]][param[2]] - a[param[0]][param[1]][param[2]]
          );
      }
    });
  }
}
