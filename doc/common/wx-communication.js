/**
 * 跨组件通信
 * 两种方式:
 * 1. 调用当前页面的方法
 * 2. 基于页面的事件总线(事件处理函数的参数请使用(options, cb))
 * 3. 基于页面的状态管理
 * 注意: 这么设计的目的是为了和小程序保持一致
 * @author 陈日正
 */

/**
 * 获取当前的页面实例
 * @returns {any}
 */
import {getCurrentPage} from 'src/wxmp/common/js/wxmp';

export {getCurrentPage};

const noop = () => false;

/**
 *事件总线
 */
export const eventBus = {
    on(event, cb) {
        getCurrentPage().eventBus.on(`eventBus.${event}`, cb);
    },
    once(event, cb) {
        getCurrentPage().eventBus.once(`eventBus.${event}`, cb);
    },
    off(event, cb) {
        getCurrentPage().eventBus.off(`eventBus.${event}`, cb);
    },
    emit(event, options = {}, cb = noop) {
        getCurrentPage().eventBus.emit(`eventBus.${event}`, options, cb);
    },
    /**
     * 返回promise的emit(需要时间处理函数的参数为(options,cb),并且必须执行cb)
     * @param event
     * @param options
     * @returns {Promise}
     */
    emitWithReturn(event, options = {}) {
        return new Promise((resolve) => {
            getCurrentPage().eventBus.emit(`eventBus.${event}`, options, resolve);
        });
    },
};

// 字符串的key解析成数组便于按层级读取
const keyToAry = (key) => key
/* eslint-disable no-useless-escape*/
    .replace(/[\[\]]/g, '.')
    .split('.')
    .filter((item) => item);
// 通过key(支持层级格式如:a.b[c][d].e[f])获取值
const getValueByKey = (target, key) => keyToAry(key).reduce((obj, item) => obj[item], target);

/**
 * 状态管理
 * 注: 数据是在page层,如果要影响到深层的组件,请把该属性一路透传下去
 */
export const store = {
    /**
     * 取值
     * 取单个值用字符串;取多个值用字符串数组
     * @param arg
     * @returns {*}
     */
    getData(arg) {
        let ret;
        const page = getCurrentPage();
        if (Array.isArray(arg)) {
            ret = {};
            arg.forEach((key) => {
                ret[key] = getValueByKey(page.data, key);
            });
        } else {
            ret = getValueByKey(page.data, arg);
        }
        return ret;
    },
    /**
     * 设值
     * 单个值用key,value;多个值直接用对象
     * @param key
     * @param value
     */
    setData(key, value) {
        const page = getCurrentPage();
        if (typeof key === 'object') {
            page.setData(key);
        } else {
            let data = {};
            data[key] = value;
            page.setData(data);
        }
    },
};

/**
 * 含name的组件自动注册事件(页面本身不注册事件)
 * 提供$bus,$store,$page
 */
/* eslint-disable no-undef */
export const communicationMix = Behavior({
    attached() {
        const {__name__: name, __methods__: methods} = this.data;
        if (name) {
            methods.forEach((funcName) => {
                const func = this[funcName].bind(this);
                this[funcName] = func;
                eventBus.on(`${name}.${funcName}`, func);
            });
        }
        this.$bus = eventBus;
        this.$store = store;
        this.$page = getCurrentPage();
    },
    beforeDestroy() {
        // 事件需要销毁,不然会越积越多
        const {__name__: name, __methods__: methods} = this.data;
        if (name) {
            methods.forEach((funcName) => (eventBus.off(`${name}.${funcName}`, this[funcName])));
        }
        this.$bus = null;
        this.$store = null;
        this.$page = null;
    },
});
