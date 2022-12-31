"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPendingNode = exports.setPendingNode = exports.pendingQueue = exports.pendingNode = void 0;
exports.pendingNode = null;
exports.pendingQueue = new Array();
function setPendingNode(node) {
    exports.pendingNode = node;
}
exports.setPendingNode = setPendingNode;
function resetPendingNode() {
    if (exports.pendingNode != null) {
        if (exports.pendingNode.parentElement)
            exports.pendingNode.parentElement.remove();
        else
            throw new Error("Unable to reset pending node.");
        exports.pendingNode = null;
    }
}
exports.resetPendingNode = resetPendingNode;
