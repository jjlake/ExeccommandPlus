export const tools: any = {
    "fgColor": {
        "get": function(elem: HTMLElement){
            return elem.getAttribute("color");
        },
        "set": function(elem: HTMLElement, val: string){
            return elem.setAttribute("color", val);
        },
    },
    "bgColor": {
        "get": function(elem: HTMLElement){
            return getComputedStyle(elem).backgroundColor;   
        },
        "set": function(elem: HTMLElement, val:string){
            elem.style.backgroundColor = val;
        }
    }
};

export const toolTags: any = {
    'B': 'bold',
    'I': 'italic',
    'U': 'underline',
    'STRIKE': "strikethrough",
    'FONT': 'fgColor',
    'SPAN': 'bgColor'
}