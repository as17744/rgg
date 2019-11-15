import Watcher from './watcher';

const updater = {
    textUpdater(node, value, oldval) { // 替换模版
        if (oldval && value === oldval) {
            return;
        }
        node.textContent = value || '';
    }
}

const compileUtil = { // 统一的编译方法
    text(node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },
    bind(node, vm, exp, type) {
        const updateFunction = updater[`${type}Updater`];
        typeof updateFunction === 'function' && updateFunction(node, this._getVMVal(vm, exp));
        new Watcher(vm, exp, (val, oldval) => {
            typeof updateFunction === 'function' && updateFunction(node, val, oldval);
        });
    },
    _getVMVal(vm, exp) { // 获得dom模版的值
        let val = vm;
        exp = exp.split('.');
        exp.forEach(function(k) {
            val = val[k];
        });
        return val;
    },
};

function Compile(el, vm) {
    this.$vm = vm; // 即外部的this
    this.$el = document.querySelector(el); // 获得目标dom
    if (this.$el) {
        this.$fragment = this.node2Fragment(this.$el);
        this.compileElement(this.$fragment);
        this.$el.appendChild(this.$fragment);
    }
};

Compile.prototype = {
    constructor: Compile,
    node2Fragment(el) {
        const fragment = document.createDocumentFragment();
        while (el.firstChild) {
            fragment.appendChild(el.firstChild); // 把目标dom里面内容塞到fragment里
        }
        return fragment;
    },
    compileElement(el) { // 这里的el是fragment
        const childNodes = el.childNodes;
        const me = this; // compile里的this
        [].slice.call(childNodes).forEach((node) => { // 所有节点
            const text = node.textContent;
            const reg = /\{\{(.*)\}\}/; // 获取{{}}内容
            if (me.isNodeElement(node)) {
                // me.compileElement(node);
            } else if (me.isNodeText(node)) { // 文本节点node依旧是个节点，文本节点里面的textContent是文本节点的文本内容
                const regMatch = text.match(reg);
                if (regMatch) {
                    me.compileText(node, regMatch[1]); // 处理文本信息
                }
            }
            if (node.childNodes && node.childNodes.length) {
                me.compileElement(node);
            }
        });
    },
    compileText(node, exp) {
        compileUtil.text(node, this.$vm, exp); // compileUtil统一处理所有编译
    },
    isNodeElement(node) { // 判断是不是非纯文本的dom节点
        return node.nodeType === 1;
    },
    isNodeText(node) {
        return node.nodeType === 3;
    },
};
export default Compile;
