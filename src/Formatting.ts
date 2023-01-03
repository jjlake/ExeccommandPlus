import * as manipulation from "./manipulation";
import { getRelation, RelationType } from "./relation";
import { tools, toolTags } from "./tools";
const rangy = require('rangy')

type Formatting = {
    tag: string;
    value: string|null;
};

export function getFormatting(elem: HTMLElement): Formatting {
    var toolName = toolTags[elem.tagName];
    var tool = tools[toolName];
    if((typeof tool)==="undefined"){
        return {
            tag: elem.tagName,
            value: null
        }
    }
    return {
        tag: elem.tagName,
        value: tool["get"](elem)
    }
}

const EMPTY_TEXT_NODE_CONTENTS = '\u200B';
const PLACEHOLDER_NODE_TAG = 'div';

export function createEmptyTextNode(){
    var elem = document.createElement("span");
    elem.innerHTML = EMPTY_TEXT_NODE_CONTENTS;
    return elem;
}

function collapseSelectionAfterRange(range: RangyRange){
    range.collapse(false);
    var newSelection = rangy.getSelection();
    newSelection.setSingleRange(range);
}

function collapseSelectionAfterNode(node: Node){
    var range = rangy.createRange();
    range.collapseAfter(node);
    collapseSelectionAfterRange(range);
}

export function applyFormatting(container: HTMLElement, range: RangyRange, formatting: Formatting): boolean {
    var relation = getRelation(container, formatting);
    if(!range.collapsed){
        // If range is not collapsed, then check if any relationships (eg, colliding or containing) any formatting elements.
        var textRange = range.toCharacterRange(container);
        if(relation!=null){
            switch(relation.type){
                case RelationType.WITHIN:
                    manipulation.split(range, container, relation.elem);
                    break;
                case RelationType.OVERLAPS:
                    relation.elem.outerHTML = relation.elem.innerHTML;
                    break;
                case RelationType.COLLIDES:
                case RelationType.CONTAINS:
                    manipulation.expand(container, relation.elem, range);
            }
        }
        
        // If no intersection with existing formatting elements of same type,
        //  just surround the range with a new formatting element.
        manipulation.surround(range, formatting);

        // Set selection to collapse at end of the modified range.
        var newSelectionRange = rangy.createRange();
        newSelectionRange.selectCharacters(container, textRange.start, textRange.end);
        collapseSelectionAfterRange(newSelectionRange)

    } else {
        // If range is collapsed, either split the containing formatting element of same type
        //   (if one exists) or signal to create a new 'pending' node which will later be filled with
        //   user input.
        if(relation!=null){
            var textRange = range.toCharacterRange(container);
            if(relation.type == RelationType.WITHIN){
                let first = manipulation.split(range, container, relation.elem);
                // Set selection to collapse at end of the modified range.
                collapseSelectionAfterNode(first);
            }
            } else {
                return true;
            }
        }
    
    return false;
}

export default Formatting;