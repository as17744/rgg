import './index.less';

const debounce = function(fn, wait) {
    let timeout = null;
    return function () {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        timeout = setTimeout(fn, wait); // 即使把上一次的销毁了，也要重新赋予计时
    };
};

window.addEventListener('scroll', debounce(() => {
    console.log(123);
}, 50));
