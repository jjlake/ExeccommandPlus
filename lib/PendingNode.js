"use strict";
// import { waitForMutation } from "./MutationTracker";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rangy = require('rangy');
// For a specific element in the DOM tree, get the innermost (i.e. deepest) child node.
function getInnermostElement(elem) {
    if (elem.firstElementChild)
        return getInnermostElement(elem.firstElementChild);
    return elem;
}
class PendingNode {
    constructor(tag, range) {
        this.elem = document.createElement(tag);
        this.range = range;
        this.insert = this.insert.bind(this);
    }
    addChild(node) {
        let innermostChildElement = getInnermostElement(this.elem);
        innermostChildElement.appendChild(node);
    }
    insert(textContent, range) {
        return __awaiter(this, void 0, void 0, function* () {
            let textNode = document.createTextNode(textContent);
            this.addChild(textNode);
            range.insertNode(this.elem);
            let newRange = rangy.createRange();
            newRange.selectNodeContents(getInnermostElement(this.elem));
            newRange.collapse();
            let newSelection = rangy.getSelection();
            newSelection.setSingleRange(newRange);
        });
    }
}
exports.default = PendingNode;
