import Formatting from "./Formatting";
import {tools, toolTags} from "./tools";

var rangy = require("rangy");
require("rangy/lib/rangy-textrange");

function getParents(limit: HTMLElement, currentNode: HTMLElement){
    var parents = Array();
    if(currentNode!=limit){
        currentNode = currentNode.parentNode as HTMLElement;
        while(currentNode!=limit){
            parents.push(currentNode)
            currentNode = currentNode.parentNode as HTMLElement;
        }
    }
    return parents;
}

export function getParentOfType(limit: HTMLElement, currentNode: HTMLElement, formatting: Formatting): HTMLElement|null {
    if(currentNode!=limit){
        while(currentNode!=limit){
            let value = null
            let getValFn = tools[toolTags[formatting.tag]];
            if(getValFn != undefined)
                value = (currentNode);
            if(currentNode.tagName==formatting.tag && formatting.value==value){
                return currentNode;
            }
            currentNode = currentNode.parentNode as HTMLElement;
        }
    }
    return null;
}

export function getNodeFromBookmark(start: Number, end: Number, formatting: Formatting): Node|null {
    var currentNode = document.getElementById("inputarea");
    var treeWalker = document.createTreeWalker(currentNode as Node, NodeFilter.SHOW_ELEMENT);
    var range = rangy.createRange();
    while(currentNode = treeWalker.nextNode() as HTMLElement){
        range.selectNode(currentNode);
        var newBookmark = range.toCharacterRange(document.getElementById("inputarea"))
        if(newBookmark.start==start && newBookmark.end==end ){
            if(formatting.tag!==null && currentNode.tagName==formatting.tag||formatting.tag==null && formatting.value==tools[formatting.tag]['get'](currentNode))
                return currentNode;
        }
    }
    return null;
}

export function getRangeAtSelection(){
    return rangy.getSelection().getRangeAt(0);
}