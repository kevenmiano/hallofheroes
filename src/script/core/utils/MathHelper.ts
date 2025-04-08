
export default class MathHelper {

    /**
        * 角度转弧度
        */
    public static deg2Rad: number = Math.PI / 180;

    /**
     * 弧度转角度
     */
    public static rad2Deg: number = 180 / Math.PI;

    /**
     * 
     * @param x1 
     * @param y1 
     * @param x2 
     * @param y2 
     */
    static distance(x1: number, y1: number, x2: number, y2: number) {
        let dx: number = x1 - x2;
        let dy: number = y1 - y2;
        let distance: number = Math.sqrt(dx * dx + dy * dy);
        return distance;
    }

    /**
     * 获取一个区间的随机数
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    public static limit($from, $end) {
        $from = Math.min($from, $end);
        $end = Math.max($from, $end);
        var range = $end - $from;
        return $from + Math.random() * range;
    };

    /**
    * 获取一个区间的随机数(帧数)
    * @param $from 最小值
    * @param $end 最大值
    * @returns {number}
    */
    public static limitInteger($from, $end) {
        return Math.round(this.limit($from, $end));
    };

    public static Normalize(x: number, y: number, temp: Laya.Point) {
        let magnitude = Math.sqrt(x * x + y * y);
        if (magnitude > 9.9E-06) {
            temp.x = x / magnitude
            temp.y = y / magnitude
        } else {
            temp.x = 0
            temp.y = 0
        }
    }

    /**
     * 根据角度获得弧度
     * @param radian 
     */
    static getAngleByRadian(radian: number) {
        return radian * 57.3
    }

    static getRadinByAngle(angle: number) {
        return angle / 57.3;
    }

    /**
     * 获得弧度
     * @param x1 
     * @param y1 
     * @param x2 
     * @param y2 
     */
    static getRadianByXY(x1: number, y1: number, x2: number, y2: number) {
        let disx = Math.abs(x2 - x1);
        let disy = Math.abs(y2 - y1);
        let dis = Math.sqrt(disx * disx + disy * disy)
        let radian: number = Math.asin(disx / dis)
        return radian;
    }

    /**
     * 获得角度
     * @param x1 
     * @param y1 
     * @param x2 
     * @param y2 
     */
    static getAngleByXY(x1: number, y1: number, x2: number, y2: number) {
        return this.getRadianByXY(x1, y1, x2, y2) * Math.PI;
    }


    /**
     * 生成从start到end的随机整数[start,end]
     * @param start 初始
     * @param end 结束
     * @returns 
     */
    static randomValue(start: number = 0, end: number = 10): number {
        return start + parseInt((Math.random() * (end + 1 - start)).toString()); //生成从m到n的随机整数[m,n]
    }


    /**
     * 弧度制转换为角度值
     * @param radian 弧度制
     * @returns {number}
     */
    public static getAngle(radian) {
        return 180 * radian / Math.PI;
    };
    /**
     * 角度值转换为弧度制
     * @param angle
     */
    public static getRadian(angle) {
        return angle / 180 * Math.PI;
    };
    /**
     * 获取两点间弧度
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    public static getRadian2(p1X, p1Y, p2X, p2Y) {
        var xdis = p2X - p1X;
        var ydis = p2Y - p1Y;
        return Math.atan2(ydis, xdis);
    };
    /**
     * 获取两点间距离
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    public static getDistance(p1X, p1Y, p2X, p2Y) {
        var disX = p2X - p1X;
        var disY = p2Y - p1Y;
        var disQ = disX * disX + disY * disY;
        return Math.sqrt(disQ);
    };

    public static GetDisSqrt(p1X: number, p1Y: number, p2X: number, p2Y: number) {
        var disX = p2X - p1X;
        var disY = p2Y - p1Y;
        return disX * disX + disY * disY;
    };

    public static GetDisSqrt2(pos1: { x: number, y: number }, pos2: { x: number, y: number }) {
        var disX = pos1.x - pos2.x;
        var disY = pos1.y - pos2.y;
        return disX * disX + disY * disY;
    }

    /** 角度移动点 */
    public static getDirMove(angle, distance, p?: Laya.Point) {
        p = p || new Laya.Point();
        p.x = Math.cos(angle * Math.PI / 180) * distance;
        p.y = Math.sin(angle * Math.PI / 180) * distance;
        return p;
    }


    /**
     * 在一个数组中随机获取一个元素
     * @param arr 数组
     * @returns {any} 随机出来的结果
     */
    public static randomArray(arr) {
        var index = Math.floor(Math.random() * arr.length);
        return arr[index];
    };

    public static RandomArrayData<T>(source: T[], n: number): T[] {
        let len = source.length
        if (n >= len) {
            return source
        }
        let result = []
        for (let i = 0; i < n; i++) {
            var index = Math.floor(Math.random() * len) % len;
            --len
            result[i] = source[index];
            source[index] = source[len];
        }
        return result;
    }

    public static RandomArr(min: number, max: number, n: number): number[] {
        let len = max - min + 1;
        if (max < min || n > len) {
            return [];
        }
        //初始化给定范围的待选数组
        let source = []
        for (let i = min; i < min + len; i++) {
            source[i - min] = i;
        }
        return this.RandomArrayData(source, n)
    }

    public static Clamp(value: number, min: number, max: number): number {
        if (value < min) {
            return min
        }
        if (value > max) {
            return max
        }
        return value
    }

    private static RAN_SIGN = [-1, 1]

    public static GetRandomSign(): number {
        return this.RAN_SIGN[MathHelper.limitInteger(0, 1)]
    }

    public static TEMP_POS = new Laya.Point()


    public static Lerp(sx: number, sy: number, ex: number, ey: number, t: number, temp: { x: number, y: number }) {
        if (t > 1) {
            t = 1
        } else if (t < 0) {
            t = 0
        }
        temp.x = sx + (ex - sx) * t
        temp.y = sy + (ey - sy) * t
    }

    // 长度向量
    public static VectorMagnitude(x: number, y: number, length: number, temp: Laya.Point): void {
        this.Normalize(x, y, this.TEMP_POS)
        temp.x = Math.round(this.TEMP_POS.x * length)
        temp.y = Math.round(this.TEMP_POS.y * length)
    }

    // 向量延长线
    public static VectorExtension(sx: number, sy: number, ex: number, ey: number, len: number, temp: Laya.Point) {
        this.VectorMagnitude(ex - sx, ey - sy, len, temp)
        temp.x += ex
        temp.y += ey
    }

    /**
     * 获得随机方向
     */
    public static sign(x: number) {
        if (x > 0) {
            return 1;
        }

        if (x < 0) {
            return -1;
        }

        return 0;
    }

    /**
     * 插值
     * @param numStart 
     * @param numEnd 
     * @param t 
     */
    public static lerp(numStart: number, numEnd: number, t: number): number {
        if (t > 1) {
            t = 1;
        } else if (t < 0) {
            t = 0
        }

        return numStart * (1 - t) + (numEnd * t);
    }

    /**
     * 
     * @param angle1 角度插值
     * @param angle2 
     * @param t 
     */
    public static lerpAngle(current: number, target: number, t: number): number {
        current %= 360;
        target %= 360;

        var dAngle: number = target - current;

        if (dAngle > 180) {
            target = current - (360 - dAngle);
        } else if (dAngle < -180) {
            target = current + (360 + dAngle);
        }

        return (MathHelper.lerp(current, target, t) % 360 + 360) % 360;
    }

    /**
     * 按一定的速度从一个角度转向令一个角度
     * @param current 
     * @param target 
     * @param speed 
     */
    public static angleTowards(current: number, target: number, speed: number): number {
        current %= 360;
        target %= 360;

        var dAngle: number = target - current;

        if (dAngle > 180) {
            target = current - (360 - dAngle);
        } else if (dAngle < -180) {
            target = current + (360 + dAngle);
        }

        var dir = target - current;

        if (speed > Math.abs(dir)) {
            return target;
        }

        return ((current + speed * this.sign(dir)) % 360 + 360) % 360;

    }

    public static clamp(value: number, minLimit: number, maxLimit: number) {
        if (value < minLimit) {
            return minLimit;
        }

        if (value > maxLimit) {
            return maxLimit;
        }

        return value;

    }

    /**
     * 
     * @param value 获得一个值的概率
     */
    public static probability(value: number) {
        return Math.random() < value;
    }

}
