"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandExecutor = void 0;
const Formatting_1 = require("./Formatting");
const PendingNode_1 = __importDefault(require("./PendingNode"));
const mutationstack_1 = require("mutationstack");
const rangy = require('rangy');
// Attached to a html contenteditable element, converts user inputs to formatting
//  and keeps track of changes with an undo/redo stack.
class CommandExecutor {
    constructor(elem) {
        this.pendingNode = null; // Tracks formatting before html elements representing
        // formatting are added along with user text input.
        this.caretPosition = null; // Position of the caret inside the attached html contenteditable element.
        this.elem = elem;
        this.mutationTracker = new mutationstack_1.MutationTracker(this.elem);
        this.resetPendingNode = this.resetPendingNode.bind(this);
        this.maintaincaret = this.maintaincaret.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.addEventListeners();
    }
    // Undo the latest set of changes caused by a user action.
    undo() {
        this.mutationTracker.stop();
        this.resetPendingNode();
        this.mutationTracker.undo();
        this.mutationTracker.start();
    }
    // Redo the latest set of changes undone by user.
    redo() {
        this.mutationTracker.stop();
        this.resetPendingNode();
        this.mutationTracker.redo();
        this.mutationTracker.start();
    }
    // Executes a formatting command inside the contenteditable element attached to this executor.
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            let addPendingElement = false;
            this.mutationTracker.stop();
            // Wait for a mutation on the attached contenteditable/input element.
            yield new Promise((resolve) => {
                resolve((0, mutationstack_1.waitForMutation)(this.elem));
                let pendingNode = (0, Formatting_1.applyFormatting)(this.elem, command.range, command.formatting);
                if (this.pendingNode && pendingNode) {
                    addPendingElement = true;
                    this.pendingNode.addChild(document.createElement(command.formatting.tag));
                }
                else if (pendingNode) {
                    this.pendingNode = new PendingNode_1.default(command.formatting.tag, command.range);
                }
                this.cleanEmptyNodes();
            }).then(record => {
                if (this.pendingNode == null && (!addPendingElement))
                    this.mutationTracker.undoStack.push(record);
            });
            this.mutationTracker.start();
            this.elem.focus();
        });
    }
    // Start tracking all mutations (for undo/redo) in the attached contenteditable element.
    start() {
        this.mutationTracker.start();
    }
    // Stop tracking all mutations (for undo/redo) in the attached contenteditable element.
    stop() {
        this.mutationTracker.stop();
    }
    // Removes any empty elements from the attached contenteditable/input element.
    cleanEmptyNodes() {
        var elems = [];
        // Create and use a treewalker object to iterate over all elements efficiently.
        let walker = document.createTreeWalker(this.elem, NodeFilter.SHOW_ELEMENT);
        let node = walker.firstChild();
        while (node != null) {
            if (node.innerHTML == "") {
                elems.push(node);
            }
            node = walker.nextNode();
        }
        elems.forEach(elem => {
            elem.remove();
        });
    }
    // Clears the pending node object.
    resetPendingNode() {
        this.pendingNode = null;
    }
    // Updates recorded caret position to current (reported) caret position
    //  inside attached contenteditable element.
    maintaincaret(event) {
        var _a;
        let selection = rangy.getSelection();
        if (selection.rangeCount >= 1) {
            let range = selection.getRangeAt(0);
            let caretPosition = range.toCharacterRange(this.elem).start;
            if (this.pendingNode != null) {
                if (event instanceof KeyboardEvent && (event.type == "keydown")) {
                    // IF key length = 1, then assume it's a printed character... 
                    // so add it to, then insert the pending node.
                    if (event.key.length === 1 && this.caretPosition == caretPosition) {
                        event.preventDefault(); // prevents the user input being 
                        // inserted without the pending formatting.
                        (_a = this.pendingNode) === null || _a === void 0 ? void 0 : _a.insert(event.key, range);
                    }
                    else if (this.caretPosition != caretPosition) {
                        this.caretPosition = caretPosition;
                    }
                    this.resetPendingNode();
                }
            }
            this.caretPosition = caretPosition;
        }
    }
    // Add relevant user input event listeners.
    addEventListeners() {
        this.elem.addEventListener('keypress', this.maintaincaret); // Every character written
        this.elem.addEventListener('mousedown', this.maintaincaret); // Click down
        this.elem.addEventListener('mouseup', this.maintaincaret); // Click down
        this.elem.addEventListener('touchstart', this.maintaincaret); // Mobile
        this.elem.addEventListener('input', this.maintaincaret); // Other input events
        this.elem.addEventListener('paste', this.maintaincaret); // Clipboard actions
        this.elem.addEventListener('cut', this.maintaincaret);
        // this.elem.addEventListener('mousemove', this.maintaincaret); // Selection, dragging text
        this.elem.addEventListener('select', this.maintaincaret); // Some browsers support this event
        this.elem.addEventListener('selectstart', this.maintaincaret); // Some browsers support this event
        this.elem.addEventListener('keydown', this.maintaincaret); // FF
        this.elem.addEventListener('keyup', this.maintaincaret); // FF
    }
}
exports.CommandExecutor = CommandExecutor;
exports.default = CommandExecutor;
