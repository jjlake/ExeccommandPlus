"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extend = exports.expand = exports.split = exports.surround = void 0;
const Formatting_1 = require("./Formatting");
const tools_1 = require("./tools");
const rangy = require("rangy");
require("rangy/lib/rangy-textrange");
function surround(range, formatting) {
    var elem = document.createElement(formatting.tag);
    if (range.canSurroundContents()) {
        range.surroundContents(elem);
    }
    else {
        elem.appendChild(range.extractContents());
        range.insertNode(elem);
    }
    if (formatting.value != null) {
        tools_1.tools[tools_1.toolTags[formatting.tag]]["set"](elem, formatting.value);
    }
    return elem;
}
exports.surround = surround;
function getValue(elem) {
    return tools_1.tools[tools_1.toolTags[elem.tagName]]["get"](elem);
}
// function getFormatting(elem: HTMLElement): Formatting {
//     return {
//         'tag': elem.tagName,
//         'value': getValue(elem)
//     };
// }
function split(midRange, container, parent) {
    var range = rangy.createRange();
    range.selectNodeContents(parent);
    var charRange = range.toCharacterRange(container);
    var midCharRange = midRange.toCharacterRange(container);
    var formatting = (0, Formatting_1.getFormatting)(parent);
    parent.outerHTML = parent.innerHTML;
    range.selectCharacters(container, charRange.start, midCharRange.start);
    let first = surround(range, formatting);
    // this.operations.push(new SurroundOperation(container, new TextRange(this.receiver.elem, range), formattingTool))
    range.selectCharacters(container, midCharRange.end, charRange.end);
    surround(range, formatting);
    // this.operations.push(new SurroundOperation(receiver, new TextRange(this.receiver.elem, range), formattingTool))
    // this.operations.push(new UnsurroundOperation(this.receiver, element.id));
    // console.log(element)
    return first;
}
exports.split = split;
function alignToTextRange(containerNode, range) {
    var alignedRange = rangy.createRange();
    var textRange = range.toCharacterRange(containerNode);
    alignedRange.selectCharacters(containerNode, textRange.start, textRange.end);
    return alignedRange;
}
function expand(containerNode, elem, range) {
    elem.id = "temp";
    // console.log(document.getElementById("temp"))
    range = alignToTextRange(containerNode, range);
    var elemRange = rangy.createRange();
    elemRange.selectNode(elem);
    elemRange = alignToTextRange(containerNode, elemRange);
    var unionRange = range.union(elemRange); // <-- problem line!
    var formatting = (0, Formatting_1.getFormatting)(elem);
    surround(unionRange, formatting);
    elem = document.getElementById("temp");
    elem.outerHTML = elem.innerHTML;
    document.getElementById("temp").id = "";
}
exports.expand = expand;
function extend(selectionRange, container, tag) {
    // var containerId = container.id;
    Array.from(container.getElementsByTagName(tag)).forEach(elem => {
        var element = elem;
        var range = rangy.createRange();
        range.selectNode(element);
        if (selectionRange.intersectsOrTouchesRange(range))
            expand(container, element, selectionRange);
    });
}
exports.extend = extend;
