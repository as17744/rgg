import './index.less';
function Parent() {
    this.obj = {
        tag: 1,
    }
}
Parent.prototype.changeParams = function() {
    this.obj.tag++;
}
function Child1() {}
Child1.prototype = new Parent();

const bob = new Child1();
const amy = new Child1();
bob.changeParams();
bob.changeParams();
console.log(bob.obj);
console.log(amy.obj);