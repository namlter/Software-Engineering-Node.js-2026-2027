PIb-03: парсинг (TIOBE index)

Задание:
const INPUT_PATH = "./data/tiobe-top20_fetch.html";

const getContent = (html) => {
    let startTable = html.indexOf('<table id="top20"');
    let left  = html.indexOf("<tbody>", startTable);
    let right = html.indexOf("</tbody>", startTable);
    
    let tbody = html.slice(left+7, right);
    const trs = []; left = 0;
    while (tbody.indexOf("<tr>", left) > -1) {
        left = tbody.indexOf("<tr>", left), right = tbody.indexOf("</tr>", left);
        trs.push( tbody.slice(left+4, right) );
        left = right;
    } 
    // в каждой строке найти все теги td и извлечь данные из столбцов 0 1 4 5
    // это задание для лабораторки по парсингу
    return trs;
}


let html = require('fs').readFileSync(INPUT_PATH, 'utf8');
let content = getContent(html);
// console.log( content );
