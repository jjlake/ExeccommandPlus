/// <reference types="rangy" />
declare class PendingNode {
    elem: HTMLElement;
    range: RangyRange;
    constructor(tag: string, range: RangyRange);
    addChild(node: Node): void;
    insert(textContent: string, range: RangyRange): Promise<void>;
}
export default PendingNode;
