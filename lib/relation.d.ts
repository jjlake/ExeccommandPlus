import Formatting from "./Formatting";
type Relation = {
    elem: HTMLElement;
    type: RelationType;
};
export declare enum RelationType {
    WITHIN = 1,
    CONTAINS = 2,
    COLLIDES = 3,
    OVERLAPS = 4
}
export type TextRange = {
    start: Number;
    end: Number;
};
export declare function equal(a: Object, b: Object): boolean;
export declare function within(container: HTMLElement, formatting: Formatting): HTMLElement | null;
export declare function getRelation(container: HTMLElement, formatting: Formatting): Relation | null;
export {};
