function MessageCenter() {
    this.events = {};
}
MessageCenter.prototype.subscribe = function (name, fn) {
    if (!this.events[name]) {
        this.events[name] = [];
    }
    this.events[name].push(fn);
}
MessageCenter.prototype.post = function (name, params) {
    const target = this.events[name];
    const length = target.length;
    for (let i = 0; i < length; i++) {
        target[i](params);
    }
}
const center = new MessageCenter();
center.subscribe('dunk', (name) => {
    console.log(`${name} breaktrough to the paint and slam to the rim`);
});
center.subscribe('dunk', (name) => {
    console.log('The rim is broken');
});
center.post('dunk', 'Ayton');

