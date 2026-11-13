// На вход идёт HTML, который сохранил 01-axios-get.js.

const fs = require('fs');

const INPUT_PATH = './data/tiobe-top20_fetch.html';
const OUTPUT_PATH = './data/tiobe-top20_while.json';

// 1. Вырезаем из страницы содержимое таблицы <table id="top20"> ... </table>
//    и разбиваем его на строки <tr> ... </tr>

const getContent = (html) => {
  const startTable = html.indexOf('<table id="top20"');
  let left = html.indexOf('<tbody>', startTable);
  let right = html.indexOf('</tbody>', startTable);

  const tbody = html.slice(left + 7, right); // +7 — длина строки "<tbody>"

  const trs = [];
  left = 0;
  while (tbody.indexOf('<tr>', left) > -1) {
    left = tbody.indexOf('<tr>', left);
    right = tbody.indexOf('</tr>', left);
    if (right === -1) break;
    trs.push(tbody.slice(left + 4, right)); // +4 — длина строки "<tr>"
    left = right;
  }
  return trs;
};

// 2. Вспомогательные функции для одной строки таблицы

// Убираем вложенную разметку: в ячейке может лежать <img ...> или <a ...>текст</a>
const stripTags = (str) => {
  let out = '';
  let i = 0;
  while (i < str.length) {
    const lt = str.indexOf('<', i); // начало очередного тега
    if (lt === -1) {
      out += str.slice(i); // тегов больше нет — дописываем остаток
      break;
    }
    out += str.slice(i, lt); // текст перед тегом
    const gt = str.indexOf('>', lt); // конец тега
    if (gt === -1) break;
    i = gt + 1;
  }
  // простые html-сущности (replace со строкой, без регулярок)
  return out
    .split('&nbsp;').join(' ')
    .split('&amp;').join('&')
    .split('&quot;').join('"')
    .split('&#39;').join("'")
    .split('&lt;').join('<')
    .split('&gt;').join('>')
    .trim();
};

// Находим в строке <tr> все ячейки <td ...> ... </td> и возвращаем их текст
const getCells = (tr) => {
  const cells = [];
  let left = tr.indexOf('<td');
  while (left > -1) {
    const openEnd = tr.indexOf('>', left); // конец открывающего тега <td ...>
    const right = tr.indexOf('</td>', openEnd); // начало закрывающего тега
    if (openEnd === -1 || right === -1) break;
    cells.push(stripTags(tr.slice(openEnd + 1, right)));
    left = tr.indexOf('<td', right);
  }
  return cells;
};

// 3. ЗАДАНИЕ: в каждой строке найти все <td> и взять столбцы 0, 1, 4, 5
//    0 — место в рейтинге сейчас
//    1 — место год назад
//    4 — название языка
//    5 — рейтинг, %

const getData = (trs) => {
  const languages = [];
  trs.forEach((tr) => {
    const cells = getCells(tr);
    if (cells.length < 6) return; // пропускаем "битые" строки, если попадутся

    languages.push({
      pos: Number(cells[0]), // "1"        -> 1
      prev: Number(cells[1]), // "12"       -> 12
      lang: cells[4], // "Python"   -> "Python"
      rate: Number(cells[5].replace('%', '')), // "20.86%" -> 20.86
    });
  });
  return languages;
};

// 4. Запуск: читаем файл, парсим, печатаем и сохраняем в JSON
const saveToJson = (data, filePath) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`сохранено объектов — ${data.length} в файл ${filePath}`);
};

const main = () => {
  try {
    const html = fs.readFileSync(INPUT_PATH, 'utf8');
    const data = getData(getContent(html));
    console.log(data);
    saveToJson(data, OUTPUT_PATH);
  } catch (error) {
    console.error(error.message);
  }
};

main();

/*
Разметка одной строки таблицы (столбцы 0 1 2 3 4 5 6):

<tr>
  <td>1</td>
  <td>1</td>
  <td></td>
  <td class="td-top20"><img src="/wp-content/themes/tiobe/tiobe-index/images/Python.png" alt="Python page" style="vertical-align:middle"/></td>
  <td>Python</td>
  <td>20.86%</td>
  <td>-2.51%</td>
</tr>
*/
