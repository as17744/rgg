const diffAttrs = (oldProps, newProps) => {
    return (rDom) => {
        // 将所有新的属性赋予旧的节点
        for (let i in newProps) {
            rDom.setAttribute(i, newProps[i]);
        }
        // 旧的节点存在新节点不存在的属性时，则删除
        for (let j in oldProps) {
            if (!newProps[j]) {
                rDom.removeAttribute(j);
            }
        }
    };
};
const diffChildren = (oldChildren, newChildren) => {
    return (rDom) => {
        const patches = []; // 保存每个节点要做的操作
        oldChildren.forEach((oldItem, index) => {
            patches.push(diff(oldItem, newChildren[index])); // 只比较同一层的同位子节点
        });
        if (newChildren.length > oldChildren.length) { // 如果新树的子节点较多，多出的节点直接放到老节点下
            const extraItems = newChildren.slice(oldChildren.length);
            extraItems.forEach((item) => {
                const appendDom = typeof item === 'string' ? document.createTextNode(item) : item.render();
                rDom.appendChild(appendDom);
            }); 
        }
        // 每个旧的节点调用一次对应patch
        for (let i = 0; i < oldChildren.length; i++) {
            const oldDomChildren = rDom.childNodes;
            patches[i](oldDomChildren[i]);
        }
    };
};
const diff = (vDom, newVDom) => {
    if (!newVDom) {
        // 新节点不存在，删除老节点
        return (rDom) => {
            rDom.remove();
        };
    } else if (typeof newVDom === 'string') {
        // 新节点是字符串则直接代替老节点
        return (rDom) => {
            rDom.replaceWith(newVDom);
        }
    } else if (vDom.tag !== newVDom.tag) {
        // 标签类型不同，直接代替老节点
        const newRDom = newVDom.render();
        return (rDom) => {
            rDom.replaceWith(newRDom);
        };
    } else {
        // 比较属性和子元素
        return (rDom) => {
            const patchAttrs = diffAttrs(vDom.props, newVDom.props);
            patchAttrs(rDom);
            const patchChildren = diffChildren(vDom.children, newVDom.children);
            patchChildren(rDom);
        }
    }
};
export default diff;