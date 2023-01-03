"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRangeAtSelection = exports.getNodeFromBookmark = exports.getParentOfType = void 0;
const tools_1 = require("./tools");
var rangy = require("rangy");
require("rangy/lib/rangy-textrange");
function getParents(limit, currentNode) {
    var parents = Array();
    if (currentNode != limit) {
        currentNode = currentNode.parentNode;
        while (currentNode != limit) {
            parents.push(currentNode);
            currentNode = currentNode.parentNode;
        }
    }
    return parents;
}
function getParentOfType(limit, currentNode, formatting) {
    if (currentNode != limit) {
        while (currentNode != limit) {
            let value = null;
            let getValFn = tools_1.tools[tools_1.toolTags[formatting.tag]];
            if (getValFn != undefined)
                value = (currentNode);
            if (currentNode.tagName == formatting.tag && formatting.value == value) {
                return currentNode;
            }
            currentNode = currentNode.parentNode;
        }
    }
    return null;
}
exports.getParentOfType = getParentOfType;
function getNodeFromBookmark(start, end, formatting) {
    var currentNode = document.getElementById("inputarea");
    var treeWalker = document.createTreeWalker(currentNode, NodeFilter.SHOW_ELEMENT);
    var range = rangy.createRange();
    while (currentNode = treeWalker.nextNode()) {
        range.selectNode(currentNode);
        var newBookmark = range.toCharacterRange(document.getElementById("inputarea"));
        if (newBookmark.start == start && newBookmark.end == end) {
            if (formatting.tag !== null && currentNode.tagName == formatting.tag || formatting.tag == null && formatting.value == tools_1.tools[formatting.tag]['get'](currentNode))
                return currentNode;
        }
    }
    return null;
}
exports.getNodeFromBookmark = getNodeFromBookmark;
function getRangeAtSelection() {
    return rangy.getSelection().getRangeAt(0);
}
exports.getRangeAtSelection = getRangeAtSelection;
