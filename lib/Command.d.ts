/// <reference types="rangy" />
import Formatting from "./Formatting";
export declare class Command {
    formatting: Formatting;
    range: RangyRange;
    constructor(formatting: Formatting, range: RangyRange);
}
export default Command;
