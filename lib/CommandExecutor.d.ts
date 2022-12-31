/// <reference types="rangy" />
import Command from "./Command";
import PendingNode from "./PendingNode";
import { MutationTracker } from "mutationstack";
export declare class CommandExecutor {
    mutationTracker: MutationTracker;
    elem: HTMLElement;
    pendingNode: PendingNode | null;
    caretPosition: RangyRange | null;
    constructor(elem: HTMLElement);
    undo(): void;
    redo(): void;
    execute(command: Command): Promise<void>;
    start(): void;
    stop(): void;
    cleanEmptyNodes(): void;
    resetPendingNode(): void;
    maintaincaret(event: Event): void;
    addEventListeners(): void;
}
export default CommandExecutor;
