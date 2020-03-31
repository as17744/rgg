// const a = 123;

// const obj = {
//     a: () => {
//         console.log(this);
//     },
//     b() {
//         const c = () => {
//             console.log(this);
//         };
//         c();
//     }
// }
// const b = () => {
//     console.log(this);
// }
// // b();
// // obj.a();
// // obj.b();
// console.log(this);

setTimeout(() => {
    console.log(1);
}, 0);

new Promise((resolve) => {
    console.log(2);
    resolve();
}).then(() => {
    console.log(3);
});

console.log(4);