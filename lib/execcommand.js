"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execCommand = void 0;
const Command_1 = __importDefault(require("./Command"));
const CommandExecutor_1 = __importDefault(require("./CommandExecutor"));
const rangy = require("rangy");
const executors = new Map();
const execCommandTags = new Map([
    ['bold', 'B'],
    ['italic', 'I']
]);
// From selection, get the first ancestor element that is contenteditable.
function getContentEditableAncestor() {
    let selection = rangy.getSelection();
    if (selection.rangeCount == 0)
        return null;
    let range = selection.getRangeAt(0);
    let node = range.commonAncestorContainer;
    while (node.parentNode) {
        node = node.parentNode;
        if (node.nodeType == Node.ELEMENT_NODE) {
            let elem = node;
            if (elem.isContentEditable)
                return elem;
        }
    }
    return null;
}
function attachExecutor(elem) {
    let executor = new CommandExecutor_1.default(elem);
    executors.set(elem, executor);
    return executor;
}
function execCommand(commandId, showUI, value) {
    console.log("my execcommand");
    let selection = rangy.getSelection();
    if (selection.rangeCount == 0) {
        throw Error("No selection found!");
    }
    let selectedElement = getContentEditableAncestor(); // find the contenteditable inside which user selection sits
    if (!selectedElement) {
        throw Error("No contenteditable div ancestor.");
    }
    let executor = executors.get(selectedElement);
    if (!executor) {
        executor = attachExecutor(selectedElement);
    }
    let range = selection.getRangeAt(0);
    let tag = execCommandTags.get(commandId);
    if (!tag) {
        throw Error("Invalid command id (" + commandId + ").");
    }
    let formatting = { tag: tag, value: null };
    let command = new Command_1.default(formatting, range);
    executor.execute(command);
    return true;
}
exports.execCommand = execCommand;
