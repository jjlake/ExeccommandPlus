"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolTags = exports.tools = void 0;
exports.tools = {
    "foreColor": {
        "get": function (elem) {
            return elem.getAttribute("color");
        },
        "set": function (elem, val) {
            return elem.setAttribute("color", val);
        },
    },
    "hiliteColor": {
        "get": function (elem) {
            return getComputedStyle(elem).backgroundColor;
        },
        "set": function (elem, val) {
            elem.style.backgroundColor = val;
        }
    }
};
exports.toolTags = {
    'B': 'bold',
    'I': 'italic',
    'U': 'underline',
    'STRIKE': "strikeThrough",
    'FONT': 'foreColor',
    'SPAN': 'hiliteColor'
};
