import Formatting, { getFormatting } from "./Formatting";
// import * as manipulation from "./manipulation";
import * as util from "./util";

var rangy = require("rangy");
require("rangy/lib/rangy-textrange");

type Relation = {
    elem: HTMLElement
    type: RelationType
}

export enum RelationType {
    WITHIN = 1,
    CONTAINS,
    COLLIDES,
    OVERLAPS
}

export type TextRange = {
    start: Number
    end: Number
}

export function within(container: HTMLElement, formatting: Formatting): HTMLElement|null {
    var range = rangy.getSelection().getRangeAt(0);
    var parent = util.getParentOfType(container, range.commonAncestorContainer as HTMLElement, formatting.tag);
    if(!parent)
        return null;
    var textRange = range.toCharacterRange(container);
    var parentRange = rangy.createRange();
    parentRange.selectNode(parent);
    var parentTextRange = parentRange.toCharacterRange(container);
    var parentFormatting = getFormatting(parent);
    if(formatting.tag==parentFormatting.tag && formatting.value==parentFormatting.value && 
        (textRange.start>parentTextRange.start && textRange.end==parentTextRange.end) ||
        (textRange.start==parentTextRange.start && textRange.end<parentTextRange.end) || 
        (textRange.start>parentTextRange.start && textRange.end<parentTextRange.end)){
        return parent;
    }
    return null;
}

export function getRelation(container: HTMLElement, formatting: Formatting): Relation | null {
        var selectionRange = rangy.getSelection().getRangeAt(0);
        var selectionTextRange = selectionRange.toCharacterRange(container);
        var currentNode: HTMLElement|null = container;
        var treeWalker = document.createTreeWalker(currentNode as Node, NodeFilter.SHOW_ELEMENT);
        var range = rangy.createRange();
        var parent = within(container, formatting)
        if(parent){
            return {elem: parent, type: RelationType.WITHIN};
        }
        while(currentNode = (treeWalker.nextNode() as HTMLElement)){
            range.selectNode(currentNode);
            var textRange = range.toCharacterRange(container);
            if(formatting.tag!==null && currentNode.tagName==formatting.tag){
                var relationType: RelationType|null = null;
                // Catch the instance where the selection collides with the end of the containing node.
                if(textRange.start<selectionTextRange.start && textRange.end==selectionTextRange.end){
                    relationType = RelationType.WITHIN;
                } else if(overlaps(selectionTextRange, textRange)){
                    relationType = RelationType.OVERLAPS;
                } else if(contains(selectionTextRange, textRange)){
                    relationType = RelationType.CONTAINS;
                } else if(collides(selectionTextRange, textRange))
                    relationType = RelationType.COLLIDES;
                if(relationType!=null){
                    return {elem: currentNode as HTMLElement, type: relationType};
                }
            }
        }
        return null;
}

function contains(selection: TextRange, range: TextRange): boolean {
    return range.start>selection.start && range.end<selection.end;
}

function collides(selection: TextRange, range: TextRange): boolean {
    return (range.start<selection.start && range.end<selection.end) ||
           (range.start>selection.start && range.end>selection.end);
}

function overlaps(selection: TextRange, range: TextRange): boolean {
    return range.start==selection.start && range.end==selection.end;
}