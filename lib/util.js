"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRangeAtSelection = exports.getNodeFromBookmark = exports.getParentOfType = void 0;
const Tool = __importStar(require("./tools"));
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
function getParentOfType(limit, currentNode, /*formatting: Formatting,*/ tag) {
    if (currentNode != limit) {
        while (currentNode != limit) {
            // var tag = formatting.tag;
            // var value = currentNode.getAttribute(formatting.valueAttribute);
            if (currentNode.tagName == tag /* && formatting.value==value*/) {
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
            if (formatting.tag !== null && currentNode.tagName == formatting.tag || formatting.tag == null && formatting.value == Tool.tools[formatting.tag]['get'](currentNode))
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
