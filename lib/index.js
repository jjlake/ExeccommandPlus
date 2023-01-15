"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = exports.CommandExecutor = void 0;
const execcommand_1 = require("./execcommand");
var CommandExecutor_1 = require("./CommandExecutor");
Object.defineProperty(exports, "CommandExecutor", { enumerable: true, get: function () { return CommandExecutor_1.CommandExecutor; } });
var Command_1 = require("./Command");
Object.defineProperty(exports, "Command", { enumerable: true, get: function () { return Command_1.Command; } });
document.execCommand = execcommand_1.execCommand;
