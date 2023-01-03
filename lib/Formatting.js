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
exports.applyFormatting = exports.createEmptyTextNode = exports.getFormatting = void 0;
const manipulation = __importStar(require("./manipulation"));
const relation_1 = require("./relation");
const tools_1 = require("./tools");
const rangy = require('rangy');
function getFormatting(elem) {
    var toolName = tools_1.toolTags[elem.tagName];
    var tool = tools_1.tools[toolName];
    if ((typeof tool) === "undefined") {
        return {
            tag: elem.tagName,
            value: null
        };
    }
    return {
        tag: elem.tagName,
        value: tool["get"](elem)
    };
}
exports.getFormatting = getFormatting;
const EMPTY_TEXT_NODE_CONTENTS = '\u200B';
const PLACEHOLDER_NODE_TAG = 'div';
function createEmptyTextNode() {
    var elem = document.createElement("span");
    elem.innerHTML = EMPTY_TEXT_NODE_CONTENTS;
    return elem;
}
exports.createEmptyTextNode = createEmptyTextNode;
function collapseSelectionAfterRange(range) {
    range.collapse(false);
    var newSelection = rangy.getSelection();
    newSelection.setSingleRange(range);
}
function collapseSelectionAfterNode(node) {
    var range = rangy.createRange();
    range.collapseAfter(node);
    collapseSelectionAfterRange(range);
}
function applyFormatting(container, range, formatting) {
    var relation = (0, relation_1.getRelation)(container, formatting);
    if (!range.collapsed) {
        // If range is not collapsed, then check if any relationships (eg, colliding or containing) any formatting elements.
        var textRange = range.toCharacterRange(container);
        if (relation != null) {
            switch (relation.type) {
                case relation_1.RelationType.WITHIN:
                    manipulation.split(range, container, relation.elem);
                    break;
                case relation_1.RelationType.OVERLAPS:
                    relation.elem.outerHTML = relation.elem.innerHTML;
                    break;
                case relation_1.RelationType.COLLIDES:
                case relation_1.RelationType.CONTAINS:
                    manipulation.expand(container, relation.elem, range);
            }
        }
        // If no intersection with existing formatting elements of same type,
        //  just surround the range with a new formatting element.
        manipulation.surround(range, formatting);
        // Set selection to collapse at end of the modified range.
        var newSelectionRange = rangy.createRange();
        newSelectionRange.selectCharacters(container, textRange.start, textRange.end);
        collapseSelectionAfterRange(newSelectionRange);
    }
    else {
        // If range is collapsed, either split the containing formatting element of same type
        //   (if one exists) or signal to create a new 'pending' node which will later be filled with
        //   user input.
        if (relation != null) {
            var textRange = range.toCharacterRange(container);
            if (relation.type == relation_1.RelationType.WITHIN) {
                let first = manipulation.split(range, container, relation.elem);
                // Set selection to collapse at end of the modified range.
                collapseSelectionAfterNode(first);
            }
        }
        else {
            return true;
        }
    }
    return false;
}
exports.applyFormatting = applyFormatting;
