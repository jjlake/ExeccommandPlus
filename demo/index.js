'use strict';

const execCommander = require("../lib/index.js");
const rangy = require("rangy");

 var commandExecutor;


addEventListener("load", function(){
    var elem = document.getElementById("inputarea");
    commandExecutor = new execCommander.CommandExecutor(elem);
    commandExecutor.start();
    document.getElementById("redoBtn").addEventListener("click", commandExecutor.redo);
    document.getElementById("undoBtn").addEventListener("click", commandExecutor.undo);
    document.getElementById("boldBtn").addEventListener("click", function(){
        document.execCommand("bold",false,null)
        // var command = new execCommander.Command({tag: 'B', value: null}, rangy.getSelection().getRangeAt(0));
        // commandExecutor.execute(command);
        document.getElementById("inputarea").focus();
    });
    document.getElementById("italiciseBtn").addEventListener("click", function(){
        var command = new execCommander.Command({tag: 'I', value: null}, rangy.getSelection().getRangeAt(0));
        commandExecutor.execute(command);
        document.getElementById("inputarea").focus();
    });
    let fgColSelect = document.getElementById("FgColSelect");
    fgColSelect.addEventListener("change", function(){
        console.log(fgColSelect.value);
        var command = new execCommander.Command({tag: 'FONT', value: fgColSelect.value}, rangy.getSelection().getRangeAt(0));
        commandExecutor.execute(command);
        document.getElementById("inputarea").focus();
    });
    let bgColSelect = document.getElementById("BgColSelect");
    bgColSelect.addEventListener("change", function(){
        console.log(fgColSelect.value);
        var command = new execCommander.Command({tag: 'SPAN', value: bgColSelect.value}, rangy.getSelection().getRangeAt(0));
        commandExecutor.execute(command);
        document.getElementById("inputarea").focus();
    });
});

