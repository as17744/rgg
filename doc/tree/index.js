import Tree from './tree';
import diff from './diff';
const creareItem = (count) => {
    return new Tree('div', {
        id: 'my-div',
        class: `my-class-${count}`
    }, [
        new Tree('div', {}, [`item${count}`]),
        new Tree('div', {}, [`item${count + 1}`]),
    ]);
};
const vDom = creareItem(2);
let realDom = vDom.render();
document.getElementById('content').appendChild(realDom);
const newVdom = new Tree('div', {
    id: 'my-div',
    class: `my-class-random`
}, [
    new Tree('div', {}, [`item123`]),
    new Tree('div', {}, [`item13213213`]),
    'bbbb'
]);
const patch = diff(vDom, newVdom);
patch(realDom);
// setInterval(() => {
//     const count = Math.floor(Math.random() * 10);
//     const patch = diff(vDom, creareItem(count));
//     patch(realDom);
// }, 500);

