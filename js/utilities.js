function getRedFromColor(color){
    // Регулярное выражение для извлечения чисел
    const regex = /\d+/g;

    // Извлечение чисел из строки
    const colorValues  = color.match(regex);

    // Преобразование в числа и присвоение переменным
    return parseInt(colorValues [0]);
}

function getBlueFromColor(color){
    // Регулярное выражение для извлечения чисел
    const regex = /\d+/g;

    // Извлечение чисел из строки
    const colorValues  = color.match(regex);

    // Преобразование в числа и присвоение переменным
    return parseInt(colorValues [2]);
}