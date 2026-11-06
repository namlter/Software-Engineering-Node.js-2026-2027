const fs = require('fs');
const log = console.log;

// 1) Читаем входной файл
const text = fs.readFileSync('./input.txt', 'utf8');

// 2) Разбиваем текст на строки
const lines = text.split('\n');

// 3) Очистка строки: оставляем только буквы и цифры, регистр — нижний
function cleanLine(line) {
    let cleaned = '';
    const lowerLine = line.toLowerCase(); // все буквы делаем строчными
    for (const ch of lowerLine) {
        // Если символ — русская буква, латинская буква или цифра — оставляем
        if (/[а-яёa-z0-9]/.test(ch)) {
            cleaned += ch;
        }
    }
    return cleaned;
}

// 4) Проверка на палиндром: сравниваем символы с двух концов
function isPalindrome(str) {
    let left = 0;
    let right = str.length - 1;
    while (left < right) {
        if (str[left] !== str[right]) {
            return false; // нашли несовпадение — не палиндром
        }
        left = left + 1;
        right = right - 1;
    }
    return true;
}

// 5) Обрабатываем каждую строку и собираем результат
let result = '';
for (const line of lines) {
    if (line.trim() === '') {
        continue; // пустую строку пропускаем
    }
    const cleaned = cleanLine(line);
    const mark = isPalindrome(cleaned) ? '+' : '-';
    result += `${mark} ${line}\n`;
}

// 6) Записываем результат в новый файл
fs.writeFileSync('./output.txt', result, 'utf8');
log('Готово! Смотри результат в файле output.txt');