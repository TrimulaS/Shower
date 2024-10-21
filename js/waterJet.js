// Save max width to clear rect



class WaterJet {
    static count = 0;

    jetLengthConstPart = 10;
    jetLengthVariablePart = 30;
    jetSpaceConstPart = 2;
    jetSpaceVariablePart = 7;
    jetSpace = 0;

    // Listener jet drop gone:
    OnJetOutOfBorderCallBack = null;


    constructor(ctx, left, top, levelUp = 20, levelDown = 500, speed = 2, color = 'blue', width = 5) {
        this.canvas = canvas;
        this.ctx = ctx;     //canvas.getContext('2d');
        this.left = left;
        this.top = top;
        this.levelUp = levelUp;
        this.levelDown = levelDown;
        this.speed = speed;     // pixel per ms 
        this.color = color;
        this.width = width;

        this.rectangles = [];
        this.lastTime = 0;
        
           // (!) this variable should be in any object intended to animated witn animated batch
        this.isAlive = true;

        WaterJet.count ++;
        this.id = `WaterJet-${WaterJet.count}`;
    }



    // Метод для создания нового прямоугольника
    createRectangle() {
        const jetLength = Math.random() * this.jetLengthVariablePart + this.jetLengthConstPart;  // Случайная длина 10..30px
        //console.log(`----- New:  jetLength ${jetLength}  levelUp ${this.levelUp}`);
        //Defining space between jets
        this.jetSpace = this.jetSpaceVariablePart * Math.random() + this.jetSpaceConstPart;
        return {
            x: this.left,
            y: this.levelUp - jetLength,
            length: jetLength
        };

    }


    // Рисование текущего состояния
    draw(delta_ms) {
        if(!this.isAlive) {
            console.log(` (!)  ${this.id} A is no alive anymore`)
            return;
        }
        this.timeElapsed += delta_ms;

        //console.log(`  --- delta_ms (in Jet): ${delta_ms}`);
        const { ctx, rectangles, left, levelUp, levelDown, width, color, speed, jetSpace } = this;

        // Обновление позиции прямоугольников
        this.rectangles.forEach(rect => {

            // console.log(`-1 rect.y ${rect.y}`);
            rect.y += speed * delta_ms;  // Скорость 2px/sec
            // console.log(`-2 rect.y ${rect.y}`);

        });

        // Удаление вышедших за пределы прямоугольников
        if (this.rectangles.length > 0  && this.rectangles[0].y > levelDown) {
            this.rectangles.shift();

            //Listener implementation 
            if(this.OnJetOutOfBorderCallBack) this.OnJetOutOfBorderCallBack();
        }


        //console.log(`- Num of rects: ${this.rectangles.length}`);
        // Добавление нового прямоугольника, если последний на экране
        
        if (this.rectangles.length === 0 ) {
            this.rectangles.push(this.createRectangle());
        }
        const lastRect = this.rectangles[this.rectangles.length - 1];
        if ( lastRect.y > levelUp + lastRect.length + jetSpace) {
            this.rectangles.push(this.createRectangle());  
            
        }



     
        rectangles.forEach(rect => {
            const visibleTop = Math.max(rect.y, levelUp);  // Видимая верхняя граница
            const visibleBottom = Math.min(rect.y + rect.length, levelDown);  // Видимая нижняя граница
            // console.log(`rect x: ${rect.x}  y ${visibleTop}   w ${width}  h ${visibleBottom - visibleTop}`);
            // console.log(`levelUp ${levelUp}   levelDown${levelDown}  visibleTop ${visibleTop}   visibleBottom${visibleBottom}`);

            if (visibleBottom > visibleTop) {
                ctx.fillStyle = color;
                ctx.fillRect(rect.x, visibleTop, width, visibleBottom - visibleTop);
                // console.log(`- draw rect x: ${rect.x}  y ${visibleTop}   w ${width}  h ${visibleBottom - visibleTop}`);
                
            }
        });
    }



    // Метод для изменения параметров во время работы
    setSpeed(newSpeed) {
        this.speed = newSpeed;
    }

    setWidth(newWidth) {
        this.width = newWidth;
    }

    setColor(newColor) {
        this.color = newColor;
    }

    OnJetOutOfBorder(callback){
        this.OnJetOutOfBorderCallBack = callback;
    }
}