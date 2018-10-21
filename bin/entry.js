const glob = require('glob');
const path = require('path');
console.log('监听的目录越少，编译所需时间越少');
const position = './doc/**/index.js';
const files = glob.sync(position);
const baseConfig = {};
baseConfig.entry = {};
files.forEach((file) => {
    const entryKey = file.replace('./doc/', '').replace('/index.js', '');
    baseConfig.entry[entryKey] = file;
});
const params = JSON.parse(process.env.npm_config_argv).original;
let target = '';
for (let index in params) {
    if (params[index].indexOf('--') === 0) {
        target = params[index].replace('--', '');
    }
}
for (let item in baseConfig.entry) {
    if (item.indexOf(target) === -1) {
        delete baseConfig.entry[item];
    }
}
const templates = [];
for (let i in baseConfig.entry) {
    console.log(`${i}: ${baseConfig.entry[i]}\n`);
    const obj = {};
    obj.path = baseConfig.entry[i].replace('js', 'html');
    obj.name = i;
    templates.push(obj);
}
module.exports = {
    baseConfig,
    templates,
};