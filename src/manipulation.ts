import Formatting, { getFormatting } from "./Formatting";
import { equal } from "./relation";
import { tools, toolTags } from "./tools";
const rangy = require("rangy");
require("rangy/lib/rangy-textrange");

export function surround(range: RangyRange, formatting: Formatting): HTMLElement {
    var elem = document.createElement(formatting.tag);
    if(range.canSurroundContents()){
        range.surroundContents(elem);
    } else {
        elem.appendChild(range.extractContents());
        range.insertNode(elem)
    }
    if(formatting.value!=null){
        tools[toolTags[formatting.tag]]["set"](elem, formatting.value);
    }
    
    // Clean up any nodes within with the same tag...
    var currentNode: HTMLElement|null = elem;
    var treeWalker = document.createTreeWalker(currentNode as Node, NodeFilter.SHOW_ELEMENT);
    let toRemove = [];
    while(currentNode = (treeWalker.nextNode() as HTMLElement)){
        if(formatting.tag == getFormatting(currentNode).tag){
            toRemove.push(currentNode);
        }
        currentNode = treeWalker.nextNode() as HTMLElement;
    }
    
    toRemove.forEach(elem => {
        elem.outerHTML = elem.innerHTML;
    })

    return elem;
}

function getValue(elem: HTMLElement): string{
    return tools[toolTags[elem.tagName]]["get"](elem);
}

export function split(midRange: RangyRange, container: HTMLElement, parent: HTMLElement): HTMLElement {
    var range: RangyRange = rangy.createRange();
    range.selectNodeContents(parent);
    var charRange = range.toCharacterRange(container);
    var midCharRange = midRange.toCharacterRange(container);

    var formatting = getFormatting(parent);
    parent.outerHTML = parent.innerHTML;

    (range as any).selectCharacters(container, charRange.start, midCharRange.start);
    let first = surround(range, formatting);
    
    (range as any).selectCharacters(container, midCharRange.end, charRange.end);
    surround(range, formatting)
    return first;
}

function alignToTextRange(containerNode: HTMLElement, range: RangyRange): RangyRange {
    var alignedRange = rangy.createRange();
    var textRange = range.toCharacterRange(containerNode);
    alignedRange.selectCharacters(containerNode, textRange.start, textRange.end);
    return alignedRange;
}

export function expand(containerNode: HTMLElement, elem: HTMLElement, range: RangyRange){
    elem.id = "temp";
    
    range = alignToTextRange(containerNode, range);
    var elemRange = rangy.createRange();
    elemRange.selectNode(elem);
    elemRange = alignToTextRange(containerNode, elemRange)

    var unionRange = range.union(elemRange)
    var formatting = getFormatting(elem);
    surround(unionRange, formatting);
    elem = document.getElementById("temp") as HTMLElement;
    elem.outerHTML = elem.innerHTML;
    (document.getElementById("temp") as HTMLElement).id = "";
}



export function extend(selectionRange: RangyRange, container: HTMLElement, tag: string){
    Array.from(container.getElementsByTagName(tag)).forEach(elem => {
        var element = elem as HTMLElement;
        var range = rangy.createRange();
        range.selectNode(element);
        if(selectionRange.intersectsOrTouchesRange(range))
            expand(container, element, selectionRange);
    })
}