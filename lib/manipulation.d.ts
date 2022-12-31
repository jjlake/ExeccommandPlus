/// <reference types="rangy" />
import Formatting from "./Formatting";
export declare function surround(range: RangyRange, formatting: Formatting): HTMLElement;
export declare function split(midRange: RangyRange, container: HTMLElement, parent: HTMLElement): HTMLElement;
export declare function expand(containerNode: HTMLElement, elem: HTMLElement, range: RangyRange): void;
export declare function extend(selectionRange: RangyRange, container: HTMLElement, tag: string): void;
