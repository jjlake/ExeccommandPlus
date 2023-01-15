import { execCommand } from "./execcommand";
export {CommandExecutor} from "./CommandExecutor";
export {Command} from "./Command";

// Replacing original execCommand with this library's replacement.
document.execCommand = execCommand;