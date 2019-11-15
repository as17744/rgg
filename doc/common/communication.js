/**
 * 跨组件通信
 * 两种方式:
 * 1. 调用当前页面的方法
 * 2. 基于页面的事件总线(事件处理函数的参数请使用(options, cb))
 * 3. 基于页面的状态管理
 * 注意: 这么设计的目的是为了和小程序保持一致
 * @author 路鸣
 */

/**
 * 获取当前的页面实例
 * @returns {any}
 */
export const getCurrentPage = () => window.vue_page;

const noop = () => false;

/**
 *事件总线
 */
export const eventBus = {
    on(event, cb) {
        getCurrentPage().$on(`eventBus.${event}`, cb);
    },
    once(event, cb) {
        getCurrentPage().$once(`eventBus.${event}`, cb);
    },
    off(event, cb) {
        getCurrentPage().$off(`eventBus.${event}`, cb);
    },
    emit(event, options = {}, cb = noop) {
        getCurrentPage().$emit(`eventBus.${event}`, options, cb);
    },
    /**
     * 返回promise的emit(需要时间处理函数的参数为(options,cb),并且必须执行cb)
     * @param event
     * @param options
     * @returns {Promise}
     */
    emitWithReturn(event, options = {}) {
        return new Promise((resolve) => {
            getCurrentPage().$emit(`eventBus.${event}`, options, resolve);
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
// 通过key设值
const setValueByKey = (target, key, value) => {
    key = keyToAry(key);
    const lastKey = key.pop();
    target = key.reduce((obj, item) => obj[item], target);
    target[lastKey] = value;
};

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
                ret[key] = getValueByKey(page, key);
            });
        } else {
            ret = getValueByKey(page, arg);
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
            Object.keys(key).forEach((item) => {
                setValueByKey(page, item, key[item]);
            });
        } else {
            setValueByKey(page, key, value);
        }
    },
};

const getPublicFunc = (methods) => Object.keys(methods).filter((key) => (key[0] !== '_'));

export const communicationMix = {
    created() {
        const {methods = {}, name} = this.$options;
        const page = getCurrentPage();
        if (page) {
            if (name) {
                getPublicFunc(methods).forEach((funcName) => (eventBus.on(`${name}.${funcName}`, this[funcName])));
            }
            this.$bus = eventBus;
            this.$store = store;
            this.$page = page;
        } else {
            this.$bus = eventBus;
            this.$store = store;
        }
    },
    beforeDestroy() {
        // 事件需要销毁,不然会越积越多
        const {methods = {}, name} = this.$options;
        if (name && this !== getCurrentPage()) {
            getPublicFunc(methods).forEach((funcName) => (eventBus.off(`${name}.${funcName}`, this[funcName])));
        }
        this.$bus = null;
        this.$store = null;
        this.$page = null;
    },
};

