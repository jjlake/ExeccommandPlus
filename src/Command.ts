import Formatting from "./Formatting";

export class Command {
    formatting: Formatting;
    range: RangyRange;

    constructor(formatting: Formatting, range: RangyRange){
        this.formatting = formatting;
        this.range = range;
    }

}

export default Command;