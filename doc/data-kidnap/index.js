const obj = {
    num: 11,
};
Object.defineProperty(obj, 'num', {
    enumerable : true,
    configurable : true,
    get() {
        console.log(123);
    },
    set(val) {
        console.log(`数据劫持${val}`);
    },
});

obj.num = 11111;
console.log(obj.num);