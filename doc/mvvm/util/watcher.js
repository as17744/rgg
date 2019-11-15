import Dep from './dep';
function Watcher(vm, exp, update) {
    this.updater = update;
    this.vm = vm;
    this.exp = exp;
    this.val = this._getVal(vm, exp);
    Dep.addDep(this);
};
Watcher.prototype = {
    constructor: Watcher,
    update() {
        const oldval = this.val;
        const val = this._getVal(this.vm, this.exp);
        typeof this.updater === 'function' && this.updater(val, oldval);
        this.val = val;
    },
    _getVal(vm, exp) {
        let val = vm;
        exp = exp.split('.');
        exp.forEach(function(k) {
            val = val[k];
        });
        return val;
    },
};

export default Watcher;