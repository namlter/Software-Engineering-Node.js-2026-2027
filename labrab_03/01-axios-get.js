// Скачиваем страницу TIOBE index и сохраняем её HTML в файл,
// чтобы дальше парсить уже локальный файл (не дёргая сайт каждый раз).

const fs = require('fs');
const axios = require('axios'); // npm i axios

const URL = 'https://www.tiobe.com/tiobe-index/';
const OUTPUT_PATH = './data/tiobe-top20_fetch.html';

// вариант 1: через axios
const getHTML_axios = async () => {
  const response = await axios.get(URL); // ждём ответа
  return response.data; // возвращаем html
};

// вариант 2: через встроенный fetch (Node 18+)
const getHTML_fetch = async () => {
  const response = await fetch(URL);
  // if (!response.ok) throw new Error(`error: ${response.status}`);
  return await response.text(); // возвращаем html
};

const main = async () => {
  try {
    const html = await getHTML_axios();
    // const html = await getHTML_fetch();
    fs.writeFileSync(OUTPUT_PATH, html, 'utf8');
    console.log(`сохранено ${html.length} символов в ${OUTPUT_PATH}`);
  } catch (error) {
    console.error(error.message);
  } finally {
    // работает в любом случае
    console.log('- stop -');
  }
};

main();
