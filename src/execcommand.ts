import Command from "./Command";
import CommandExecutor from "./CommandExecutor";
const rangy = require("rangy");

// Maps executors keeping track of changes in js to elements on the DOM tree.
const executors = new Map<HTMLElement, CommandExecutor>();

// Tags which correspond to original execCommand command ids.
const execCommandTags: Map<string, string> = new Map([
    ['bold', 'B'],
    ['italic', 'I']
]);

// From selection, get the first ancestor element that is contenteditable.
function getContentEditableAncestor(): HTMLElement|null {
    let selection = rangy.getSelection();
    if(selection.rangeCount==0)
        return null;
    let range = selection.getRangeAt(0);
    let node=range.commonAncestorContainer;
    
    while(node.parentNode){
        node = node.parentNode as Node;
        if(node.nodeType==Node.ELEMENT_NODE){
            let elem = node as HTMLElement;
            if(elem.isContentEditable)
                return elem;
        }
    }
    return null;
}

// Create a CommandExecutor to maintain the undo/redo stack for a given contenteditable element.
function attachExecutor(elem: HTMLElement){
    let executor = new CommandExecutor(elem);
    executors.set(elem, executor);
    return executor;
}

// Intended as a drop-in replacement for the existing execCommand api, but with incomplete features.
export function execCommand(commandId: string, showUI?: boolean|undefined, value?:string): boolean {
    let selection = rangy.getSelection();
    if(selection.rangeCount==0){
        throw Error("No selection found!");
    }
    let selectedElement = getContentEditableAncestor(); // find the contenteditable inside which user selection sits
    if(!selectedElement){
        throw Error("No contenteditable div ancestor.")
    }
    let executor = executors.get(selectedElement);
    if(!executor){
        executor = attachExecutor(selectedElement);
    }
    let range = selection.getRangeAt(0);
    let tag = execCommandTags.get(commandId);
    if(!tag){
        throw Error("Invalid command id ("+commandId+").");
    }
    let formatting = {tag: tag, value: null};
    let command = new Command(formatting, range);
    executor.execute(command);
    return true;
}