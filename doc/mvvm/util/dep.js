const Dep = {
    list: [],
    addDep(watcher) {
        this.list.push(watcher);
    },
    notify() {
        this.list.forEach((watcher) => {
            watcher.update();
        });
    },
};

export default Dep;