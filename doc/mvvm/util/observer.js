import Dep from './dep';

function Observer(data) {
    this.data = data;
    this.walk(data);
};
Observer.prototype = {
    constructor: Observer,
    walk(data) {
        const me = this;
        Object.keys(data).forEach((key) => {
            me.defineReactive(data, key);
        });
    },
    defineReactive(data, key) {
        let val = data[key];
        Object.defineProperty(data, key, {
            configurable: false,
            enumerable: true,
            get() {
                return val;
            },
            set(newVal) {
                observe(newVal);
                val = newVal;
                Dep.notify();
            },
        });
    },
};
const observe = (data) => {
    if (!data || typeof data !== 'object') {
        return;
    }
    return new Observer(data);
};

export default observe;