const prompt = require('prompt-sync')(); // npm i prompt-sync
const log = console.log;

// Случайное целое от left до right включительно
function getRnd(left = 0, right = 1000) {
    return Math.floor(Math.random() * (right - left + 1)) + left;
}


const START_LEFT = 100;
const START_RIGHT = 999;
const START_MONEY = 1000;
const PENALTY = 100; // за каждый неправильный ход -PENALTY

let left = START_LEFT;
let right = START_RIGHT;
let money = START_MONEY;

const secretNumber = getRnd(left, right); // компьютер загадал число


log(`Я загадал число от ${left} до ${right}.`);
log(`У вас на счету ${money} монет.`);

let isWin = false;// флаг: угадал игрок или нет. 
//Изначально false, станет true, если игрок угадает число.


// Пока у игрока есть деньги — играем
while (money > 0) {
    // Спрашиваем число. Знак + превращает строку в число
    const human = +prompt(`Введите число от ${left} до ${right}: `);

    // Проверяем: угадал?
    if (secretNumber === human) {
        log(`Угадал загаданное число ${secretNumber}.`);
        isWin = true;// запоминаем победу
        break;
    } else {
        // Подсказка и сужение диапазона
        if (secretNumber > human) {
            log("Загаданное число больше.");
            left = human + 1;// слева теперь точно больше введённого
        } else {
            log("Загаданное число меньше.");
            right = human - 1;// справа теперь точно меньше введённого
        }

        money -= PENALTY;

        // Баланс показываем только если игра ещё идёт
        if (money > 0) {
            log(`У вас на счету осталось ${money} монет.`);
        }
    }
}


if (isWin) {
    log(`Игра окончена. У вас на счету осталось ${money} монет.`);
} else {
    log(`Игра окончена. Вы проиграли. У вас на счету осталось ${money} монет.`);
}





/*
в конце игры при проигрыше
не должно быть такого вывода:

У вас на счету осталось  - 0
У вас на счету осталось - 0

*/

/*
log(Math.floor(rnd), Math.ceil(rnd), Math.round(rnd), rnd);
   1 1000  |  1 700  |  400 700  |   552 556

0 2 => 0 1 2

0 - 0.0-0.5
1 - 0.5-1.5
2 - 1.5-2.0

[ 48, 101, 51 ]

    0 1
    0 = 0.0 0.1 0.2 0.4 0.49
    1 = 0.50 .. 1.49
    2 = 1.50 ..  1.8 1.9

let arr = [0, 0, 0]; // 0 1 2
for (let i=0; i<200; i++) {
    let x = getRnd(0, 2);
    log( x );
    arr[x] += 1;
}
log(arr);
*/