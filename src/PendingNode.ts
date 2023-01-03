const rangy = require('rangy');

// For a specific element in the DOM tree, get the innermost (i.e. deepest) child node.
function getInnermostElement(elem: Element): Element {
    if(elem.firstElementChild)
        return getInnermostElement(elem.firstElementChild);
    return elem;
}

class PendingNode {
    elem: HTMLElement;
    range: RangyRange;

    constructor(tag: string, range: RangyRange){
        this.elem = document.createElement(tag);
        this.range = range;
        this.insert = this.insert.bind(this);
    }

    addChild(node: Node){
        let innermostChildElement = getInnermostElement(this.elem);
        innermostChildElement.appendChild(node);
    }

    async insert(textContent: string, range: RangyRange){
        let textNode = document.createTextNode(textContent);
        this.addChild(textNode);
        
        range.insertNode(this.elem);
        let newRange = rangy.createRange();
        newRange.selectNodeContents(getInnermostElement(this.elem));
        newRange.collapse();
        let newSelection = rangy.getSelection();
        newSelection.setSingleRange(newRange);
    } 
}

export default PendingNode;