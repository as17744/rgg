export default class Tree {
    constructor(tag = '', props = {}, children = []) {
        this.tag = tag;
        this.props = props;
        this.children = children;
    }
    render() {
        const $dom = document.createElement(this.tag);
        for (let item in this.props) {
            $dom.setAttribute(item, this.props[item]);
        }
        this.children.forEach((kid) => {
            const $kid = kid instanceof Tree ? kid.render() : document.createTextNode(kid);
            $dom.appendChild($kid);
        });
        return $dom;
    }
}