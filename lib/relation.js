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
exports.getRelation = exports.within = exports.RelationType = void 0;
const Formatting_1 = require("./Formatting");
// import * as manipulation from "./manipulation";
const util = __importStar(require("./util"));
var rangy = require("rangy");
require("rangy/lib/rangy-textrange");
var RelationType;
(function (RelationType) {
    RelationType[RelationType["WITHIN"] = 1] = "WITHIN";
    RelationType[RelationType["CONTAINS"] = 2] = "CONTAINS";
    RelationType[RelationType["COLLIDES"] = 3] = "COLLIDES";
    RelationType[RelationType["OVERLAPS"] = 4] = "OVERLAPS";
})(RelationType = exports.RelationType || (exports.RelationType = {}));
// Check if two objects with keys in the *same order* (i.e. types) are equal.
function equal(a, b) {
    return JSON.stringify(a) == JSON.stringify(b);
}
function within(container, formatting) {
    var range = rangy.getSelection().getRangeAt(0);
    var parent = util.getParentOfType(container, range.commonAncestorContainer, formatting);
    if (!parent)
        return null;
    var textRange = range.toCharacterRange(container);
    var parentRange = rangy.createRange();
    parentRange.selectNode(parent);
    var parentTextRange = parentRange.toCharacterRange(container);
    var parentFormatting = (0, Formatting_1.getFormatting)(parent);
    if (equal(formatting, parentFormatting) &&
        ((textRange.start > parentTextRange.start && textRange.end == parentTextRange.end) ||
            (textRange.start == parentTextRange.start && textRange.end < parentTextRange.end) ||
            (textRange.start > parentTextRange.start && textRange.end < parentTextRange.end))) {
        return parent;
    }
    return null;
}
exports.within = within;
function getRelation(container, formatting) {
    var selectionRange = rangy.getSelection().getRangeAt(0);
    var selectionTextRange = selectionRange.toCharacterRange(container);
    var currentNode = container;
    var treeWalker = document.createTreeWalker(currentNode, NodeFilter.SHOW_ELEMENT);
    var range = rangy.createRange();
    var parent = within(container, formatting);
    console.log(parent);
    // console.log(formatting, getFormatting(parent as HTMLElement));
    if (parent /* && formatting==getFormatting(parent)*/) {
        return { elem: parent, type: RelationType.WITHIN };
    }
    while (currentNode = treeWalker.nextNode()) {
        range.selectNode(currentNode);
        var textRange = range.toCharacterRange(container);
        console.log(formatting, (0, Formatting_1.getFormatting)(currentNode));
        // if(formatting.tag!==null && currentNode.tagName==formatting.tag){
        // if(formatting==getFormatting(currentNode)){
        if (equal(formatting, (0, Formatting_1.getFormatting)(currentNode))) {
            var relationType = null;
            // Catch the instance where the selection collides with the end of the containing node.
            if (textRange.start < selectionTextRange.start && textRange.end >= selectionTextRange.end) {
                relationType = RelationType.WITHIN;
            }
            else if (overlaps(selectionTextRange, textRange)) {
                relationType = RelationType.OVERLAPS;
            }
            else if (contains(selectionTextRange, textRange)) {
                relationType = RelationType.CONTAINS;
            }
            else if (collides(selectionTextRange, textRange))
                relationType = RelationType.COLLIDES;
            if (relationType != null) {
                return { elem: currentNode, type: relationType };
            }
        }
    }
    return null;
}
exports.getRelation = getRelation;
function contains(selection, range) {
    return range.start > selection.start && range.end < selection.end;
}
function collides(selection, range) {
    return (range.start < selection.start && range.end < selection.end) ||
        (range.start > selection.start && range.end > selection.end);
}
function overlaps(selection, range) {
    return range.start == selection.start && range.end == selection.end;
}
