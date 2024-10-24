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
class AnimatedBatch {
    renderListners = [];

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.shapes = [];

        this.isAnimating = false;

        this.previousTime = performance.now();
        this.delta_ms = 0;                         // Delta between draw() methods run
    }

    add(...items) {
        this.shapes.push(...items);
        // console.log(`--- After Adding animatedItem ${this.shapes.length}`);
        // this.itemsToString() ;
    }
    clear(){
        this.shapes = [];
    }

    setOnBeforeAnimate(callback){
        this.renderListners.push(callback);
    }

    //Method to animate batch of shapes
    #render(currentTime) {

        // Stop the animation if all lists are empty
        if (this.shapes.length <= 0 ) {
            this.stop();
            console.log(`#  Finished:  AnimatedBatch: shapes: ${this.shapes} length: ${this.shapes.length}`);
            return;
        }

        this.delta_ms = currentTime - this.previousTime;
        this.previousTime = currentTime;

        //console.log(`......delta_ms: ${this.delta_ms}`);

        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.renderListners.forEach(listener => listener(this.delta_ms));

        // console.log(`--- Before filtering ${this.shapes.length}`);
        // this.itemsToString() ;
        // EDIT Modify the existing array, must work from end to beginning
        for( let next = this.shapes.length - 1; next >= 0; --next )  {

            // Then remove it if it's finished it's itterations
            if( !this.shapes[next].isAlive ){
                this.shapes.splice(next, 1)
            } 
            else{
                this.shapes[next].draw( this.delta_ms )
            }
            
          }
        // console.log(`--- After filtering ${this.shapes.length}`);
        // this.itemsToString() ;
        
        if(this.isAnimating){
            this.requestId = requestAnimationFrame((currentTime) => this.#render(currentTime));
        }
    }

    start(){
        this.isAnimating = true;
        this.#render(performance.now());
    }
    pause(){
        this.isAnimating = false;
    }

    stop(){
        //cancelAnimationFrame(this.requestId);
        this.isAnimating = false;
        this.shapes = [];
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Extract animatedItems of certain type 
    getInstancesOf(className) {
        return this.shapes.filter(item => item instanceof className);
    }

    itemsToString() {
        let strArray = this.shapes.map((item, index) => {
            return `\t ${index}. ${item.id}   isAlive :  ${item.isAlive}`;
        });
    
        let str = strArray.join("\n");
        console.log(str);
        return str;
    }
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
            // console.log(` X  ${this.id} finished`)
            return;
        }

        this.callbackDraw(delta_ms); // Вызов переданного метода отрисовки
    }
}

    