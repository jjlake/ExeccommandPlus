/// <reference types="rangy" />
type Formatting = {
    tag: string;
    value: string | null;
};
export declare function getFormatting(elem: HTMLElement): Formatting;
export declare function createEmptyTextNode(): HTMLSpanElement;
export declare function applyFormatting(container: HTMLElement, range: RangyRange, formatting: Formatting): boolean;
export default Formatting;
