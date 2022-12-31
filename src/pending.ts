export let pendingNode: Node|null = null;
export var pendingQueue = new Array<Array<MutationRecord>>();

export function setPendingNode(node: Node){
    pendingNode = node;
}

export function resetPendingNode(){
    if(pendingNode!=null){
        if(pendingNode.parentElement)
            pendingNode.parentElement.remove();
        else
            throw new Error("Unable to reset pending node.")
        pendingNode = null;
    }
}