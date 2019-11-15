
import observer from './observer';
import Compile from './compile';

function Mvvm(options) {
    const vm = this;
    this.$options = options || {};
    this._data = typeof this.$options.data === 'function' ? this.$options.data.call(this): this.$options.data;
    let data = this._data;
    // 数据代理
    // this.a -> this._data.a
    Object.keys(data).forEach((key) => {
        vm._setProxy(key);
    });
    observer(this._data);
    this._initComputed();
    this._initMethods();
    this.$compile = new Compile(options.el || document.body, this)
    typeof this.$options.created === 'function' && this.$options.created.call(this);
}
Mvvm.prototype = {
    constructor: Mvvm,
    _setProxy(key) {
        const vm = this;
        Object.defineProperty(vm, key, {
            configurable: false,
            enumerable: true,
            get() {
                return vm._data[key];
            },
            set(newVal) {
                if (newVal === vm._data[key]) {
                    return;
                }
                vm._data[key] = newVal;
            }
        });
    },
    _initComputed() {
        if (typeof this.$options.computed === 'object') {
            const vm = this;
            const computed = this.$options.computed;
            Object.keys(computed).forEach((key) => {
                Object.defineProperty(vm, key, {
                    configurable: false,
                    enumerable: true,
                    get() {
                        if (typeof computed[key] === 'function') {
                            return computed[key].call(vm);
                        }
                    },
                    set() {},
                });
            });
        }
    },
    _initMethods() {
        if (typeof this.$options.methods === 'object') {
            const vm = this;
            const methods = this.$options.methods;
            Object.keys(methods).forEach((key) => {
                vm[key] = methods[key].bind(vm);
            });
        }
    },
}
export default Mvvm;