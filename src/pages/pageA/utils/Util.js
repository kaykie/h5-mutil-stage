/* eslint-disable */
export default class Util {
    static isUndefined(value) {
        return typeof value === 'undefined';
    }

    static isDefined(value) {
        return typeof value !== 'undefined';
    }

    static isObject(value) {
        // http://jsperf.com/isobject4
        return value !== null && typeof value === 'object';
    }

    static isString(value) {
        return typeof value === 'string';
    }

    static isNumber(value) {
        return typeof value === 'number';
    }

    static isDate(value) {
        return toString.call(value) === '[object Date]';
    }

    static isFunction(value) {
        return typeof value === 'function';
    }

    static isRegExp(value) {
        return toString.call(value) === '[object RegExp]';
    }

    static isBoolean(value) {
        return typeof value === 'boolean';
    }

    static isElement(node) {
        return !!(node &&
            (node.nodeName  // we are a direct element
                || (node.prop && node.attr && node.find)));  // we have an on and find method part of jQuery API
    }

    static isArray = Array.isArray

    /**
     * 数字转字符串
     */
    static numToString(num) {
        if (Util.isNumber(num)) {
            return num + '';
        } else {
            return num;
        }
    }

    /*
     * base64格式图片压缩且上线180kB，无下限
     * file:
     * file.url 图片base64
     * callback 回调
     */
    static getImgBase64(file, callback) {
        const that = this;
        let urlSize = that.getBase64Size(file.url);
        console.log('原始大小', urlSize);
        const img = new Image();
        img.src = file.url;
        img.onload = function () {
            const sourceData = {
                sourceW: img.width,
                sourceH: img.height
            };
            const res = {
                resW: img.width,
                resH: img.height,
                url: file.url,
                size: file.file.size / 1024
            };
            let i = 0;
            while (res.size > 180) {
                let canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                res.resW = res.resW / 2;
                res.resH = res.resH / 2;
                canvas.width = res.resW;
                canvas.height = res.resH;
                console.log('开始压缩---，次数', ++i);
                console.log('压缩前大小', res.size);
                ctx.drawImage(img, 0, 0, sourceData.sourceW, sourceData.sourceH, 0, 0, res.resW, res.resH);
                res.url = canvas.toDataURL('image/jpeg', 1);
                res.size = that.getBase64Size(res.url);
                console.log('压缩后大小', res.size);
            }
            console.log('最终压缩结果', res.size);
            callback(res);
            // canvas = null;
        }
    }

    /*
     * base64图片旋转
     * file:
     * file.url 图片base64
     * callback 回调
     */
    static setBase64Rotate(file, callback) {
        const img = new Image(), result = file;
        img.src = file.url;
        img.onload = function () {
            let canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.translate(img.width / 2, img.height / 2);
            ctx.rotate(90 * Math.PI / 180);
            ctx.drawImage(img, 0 - img.height / 2, 0 - img.width / 2, img.height, img.width);
            result.url = canvas.toDataURL('image/jpeg', 1);
            callback(result);
        }
    }

    /*
     * base64格式图片获取size
     * base64url base64
     */
    static getBase64Size(base64url) {
        let str = base64url.replace('data:image/jpeg;base64,', '');
        let equalIndex = str.indexOf('=');
        if (str.indexOf('=') > 0) {
            str = str.substring(0, equalIndex);
        }
        let strLength = str.length;
        let size = (strLength - (strLength / 8 * 2)) / 1024;
        return parseInt(size);
    }

}
