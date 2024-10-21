class RandomStar {
    static count = 0;

    constructor(ctx, centerX, centerY, spikeLength = 2) {
        this.ctx = ctx;
        this.centerX = centerX;
        this.centerY = centerY;
        this.spikeLength = spikeLength;

        this.timeShine = 200;        //ms
        this.timeFade = 100;
        this.timeToLive = this.timeShine + this.timeFade;     // in ms
        this.timeElapsed = 0;

        this.deltaLength = 8;
        
        const numOfSpikesMax = 20;
        this.numOfSpikes = numOfSpikesMax + Math.floor(Math.random() * (numOfSpikesMax + 1) - numOfSpikesMax/2); // ±200% от 20
        // To make more appealing
        if(this.numOfSpikes % 2 !== 0) this.numOfSpikes ++; 
        this.spikes = [];
        this.createSpikes();
        this.opacity = 0.7;
        this.color = this.generateRandomColor();



        RandomStar.count ++;
        this.id = `RandomStar-${RandomStar.count}`;

        this.isAlive = true;
        this.OnStarGone = null;

        // this.timeLive = 5000;
        // this.timeFade = 200;
        // this.draw();
        // setTimeout(() => this.fadeOut(), this.timeLive); // через 3 секунды начать исчезновение
    }
    
    #rnd(minValue, maxValue){
    return minValue + (maxValue - maxValue) * Math.random();
    }
    //  adding distrotion ± 1 (100%) 
    #distort(value, noise){
        return value + value * noise * (1 - 2 * Math.random() ) ;
    }
    #rndColor(){
        return `rgb(${255 * Math.random()}, ${255 * Math.random()}, ${255 * Math.random()})`;
    }
    #rndColorA(opacity){
        return `rgb(${255 * Math.random()}, ${255 * Math.random()}, ${255 * Math.random()}, ${opacity})`;
    }

    createSpikes() {
        const sector = 360 / this.numOfSpikes;
        let angleIncrement = sector; // Угол с отклонением ±25%
        let currentAngle = 0;

        for (let i = 0; i < this.numOfSpikes; i++) {
            let length = this.#distort(this.spikeLength, 0.2);

            if (i % 2 === 0) {
                length += this.#distort(this.deltaLength, 0.2);  // Четный отрезок длиннее на deltaLength
            }
            // Here added Noise to current angle
            let angleDistorted = this.#distort(currentAngle, 0.005); // Угол с отклонением ±25%
            let xEnd = this.centerX + length * Math.cos(angleDistorted * Math.PI / 180);
            let yEnd = this.centerY + length * Math.sin(angleDistorted * Math.PI / 180);

            //this.#textAt(i,this.ctx,xEnd,yEnd);
            
            this.spikes.push({x: xEnd, y: yEnd});
            currentAngle += angleIncrement;
        }
    }
    #textAt(text,ctx, x,y){
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText  (text, x, y);
    }

    generateRandomColor() {
        const r = Math.min(255, Math.max(0, 230 + Math.floor(Math.random() * 50 - 25)));
        const g = Math.min(255, Math.max(0, 255 + Math.floor(Math.random() * 50 - 25)));
        const b = Math.min(255, Math.max(0, 20 + Math.floor(Math.random() * 50 - 25)));
        const a = Math.min(1, Math.max(0, 0.7 + (Math.random() * 0.5 - 0.25)));

        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    draw(delta_ms) {

        this.timeElapsed += delta_ms;
        console.log(`---${this.id}  delta_ms: ${delta_ms}   timeElapsed: ${this.timeElapsed}`);
        if(this.timeElapsed > this.timeToLive || this.opacity < 0) {
            this.isAlive = false;
            console.log(`(!)  Star is gone: ${this.id}  timeElapsed : ${this.timeElapsed}  opacity: ${this.opacity}`);
        }

        if(!this.isAlive) {
            console.log(` (!)  ${this.id} A is no alive anymore`)
            // Implement litener when star is expired
            if(this.OnStarGone)this.OnStarGone();
            return;
        }


        this.ctx.beginPath();
        this.ctx.moveTo(this.spikes[0].x, this.spikes[0].y);

        for (let i = 1; i < this.spikes.length; i++) {

            //Make it alive - add distortion
            const x =  this.#distort(this.spikes[i].x, 0.005);
            const y =  this.#distort(this.spikes[i].y, 0.005);
            this.ctx.lineTo(x, y);
        }

        this.ctx.closePath();

        this.ctx.strokeStyle = this.#rndColorA(this.opacity); // Set the stroke style to the desired color
        this.ctx.stroke(); // Draw the outline
        //Fill up
        this.ctx.fillStyle = this.#rndColorA(this.opacity); //this.color;
        this.ctx.fill();

        // console.log(`inside -- star x ${this.centerX}  y ${this.centerY}`);


        //If shine time finished - fading startred: opacity will decrease
        if(this.timeElapsed > this.timeShine){
            this.opacity -= 1 - (this.timeElapsed - this.timeShine) / this.timeFade;            // it is fading
            console.log(`- fading: ${this.id} opacity: ${this.opacity}`);
        }
    }
    addOnStarGone(callback){
        this.OnStarGone = callback;
    }
}

