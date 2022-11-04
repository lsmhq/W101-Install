// 防抖
// 多次触发的情况下只触发一次
function debounce(fn, delay) {
    let timeout = null;
    return function (event) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(this, arguments);
        }, delay);
    };
}
// 节流
// 多次触发的情况下减少触发的次数
function throttle(fn, delay) {
    let valid = true
    return function (e) {
        if (!valid) {
            return false
        }
        valid = false
        setTimeout(() => {
            fn(e)
            valid = true;
        }, delay)
    }
}
export {
    throttle, debounce
}