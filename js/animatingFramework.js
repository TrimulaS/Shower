/**
 *  Usage:  
 * 1. AnimateBatch could cllect any object implementing method:
 *      Mandatory:
 *         draw(delta_ms) and 
 *         isAlive variable
 *      Reccomended:
 *          id - to differentiate objects    
 *          count - uber of instances
 *          this.timeElapsed = 0; 
 * 2. Animated Item is the simpelest class contating just draw(delta_ms) method, enough to animate with AnimateBatchs
 * (!) anuimated item and any object used as i , should have method draw.
  
const animatedItem4 = new AnimatedItem(() => {
    divDeltaTime.textContent = `Delta: ${Math.round(performance.now())} ms`;
},10,100); // Без повторений, с постоянным обновлением
 
const animatedBatch = new AnimateBatch(); 
animatedBatch.add(animatedItem1);


<button id="buttonStart" type="button">Start</button>

// Обработчик для кнопки "Start/Stop"
buttonAnimate.addEventListener('click', function () {
    if (!animatedBatch.isAnimating) {
        animatedBatch.isAnimating = true;
        buttonAnimate.textContent = "Stop";
        requestAnimationFrame((time) => animatedBatch.startAnimation(time)); // Запуск анимации
    } else {
        animatedBatch.isAnimating = false;
        buttonAnimate.textContent = "Start";
    }
});
  
 */


//----------------------------------------------------------------------------------------------- Класс для управления пакетами анимаций
class AnimateBatch {
    animationListners = [];

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.animatedItems = [];
        this.isAnimating = false;
        this.delta_ms = 0;                  // Delta between draw() methods run
    }

    add(...items) {
        this.animatedItems.push(...items);
        console.log(`--- After Adding ${this.animatedItems.length}`);
        this.itemsToString() ;
    }

    addOnAnimate(callback){
        this.animationListners.push(callback);
    }
    start(){
        this.isAnimating = true;
        this.#animate(0);
    }

    stop(){
        cancelAnimationFrame(this.requestId);
        this.isAnimating = false;
    }
    //Method to animate batch of shapes
    #animate(previousTime) {
        if (!this.isAnimating) return;
        
        const currentTime = performance.now();  // Получаем текущее время
        this.delta_ms = previousTime ? currentTime - previousTime : 0;  // Если previousTime нет, используем 0 для первого кадра
        console.log(`delta_ms ${this.delta_ms}`);


        // Implementing listeres before draw() method of included graphic items (usually to clear graphic context)
        this.ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст
        this.animationListners.forEach(listener => listener(this.delta_ms));

        console.log(`--- Before filtering ${this.animatedItems.length}`);
        this.itemsToString() ;
        this.animatedItems = this.animatedItems.filter((item) => {
            if(this.delta_ms < 500) // Avoiding jerks: If delay is too long do not draw based on time delta
            item.draw(this.delta_ms);
            // Тут перебираются все элемены исходного массива this.animatedItems ?
            return item.isAlive; // Оставляем только те, что еще активны
        });
        console.log(`--- After filtering ${this.animatedItems.length}`);
        this.itemsToString() ;




        // If array of shapes not empty
        if (this.animatedItems.length > 0) {
            this.requestId = requestAnimationFrame((newTime) => this.#animate(newTime));

            // this.requestId = requestAnimationInterval( (newTime) => this.#animate(newTime));
            // console.log(`  -AnimateBatch length: ${this.animatedItems.length}, RandomStar: ${getInstancesOf(RandomStar).length}`);
        } else {
            this.isAnimating = false; // Останавливаем анимацию, если нет активных объектов
            // this.ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст
            console.log(` --- AnimatedBatch: Animation stopped, no live animation item remains: ${this.animatedItems} length: ${this.animatedItems.length}`);
        }
    }

    // Метод для получения всех экземпляров заданного класса
    getInstancesOf(className) {
        return this.animatedItems.filter(item => item instanceof className);
    }

    itemsToString() {
        let strArray = this.animatedItems.map((item, index) => {
            return `\t ${index}. ${item.id} :  ${item.isAlive}`;
        });
    
        let str = strArray.join("\n");
        console.log(str);
        return str;
    }
    

}

// //Alternative 

function requestAnimationInterval(callback) {
    // Определим начальное время
    let start = performance.now();
    
    // Интервал обновления - около 60 FPS
    const interval = 1000 / 60;
    
    // Создаём идентификатор интервала
    const intervalId = setInterval(() => {
        const currentTime = performance.now();
        const newTime = currentTime - start;
        
        // Вызываем переданный callback с newTime
        callback(newTime);
        clearInterval(intervalId);
    }, interval);
    
    // Возвращаем идентификатор интервала для последующей отмены
    return intervalId;
}

function cancelAnimationInterval(intervalId) {
    clearInterval(intervalId);
}










//------------------------------------------------------------------------------- Simplest shape - AnimatedItem


class AnimatedItem {
    static count = 0;

    constructor(callbackDraw, timeToLive_ms = -1, repeat = -1) {
        this.callbackDraw = callbackDraw;
        this.timeToLive = timeToLive_ms;
        this.repeat = repeat; // количество повторений
        this.isAlive = true;
        this.timeElapsed = 0;   // = timeInterval_ms;     // to start immidiately

        AnimatedItem.count ++;
        this.id = `AnimatedItem-${AnimatedItem.count}`;
    }

    draw(delta_ms) {
        // If time to live is under the contorl
        if(this.timeToLive != -1){
            this.timeElapsed += delta_ms;
            if(this.timeElapsed > timeToLive) this.isAlive = false;
        }
        if(this.repeat!= -1){
            this.repeat--;
            if(this.repeat == 0) this.isAlive = false;
        }
        if(!this.isAlive) {
            console.log(` X  ${this.id} finished`)
            return;
        }

        this.callbackDraw(delta_ms); // Вызов переданного метода отрисовки
    }
}

    