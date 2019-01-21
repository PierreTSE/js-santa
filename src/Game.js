class Game {
    constructor(canvas) {
        if (!(canvas instanceof HTMLElement) || !(canvas.nodeName === "CANVAS")) {
            throw new Error("IllegalArgument : must be a <canvas>")
        }

        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");

        // background image
        this.bg = new Image();
        this.bg.src = "../rc/snow.jpg";

        // player santa
        let santa = new Santa("../rc/santa.png", 3, 4, 0.5);

        // all the Character managed in the game
        this.entities = [];
        this.entities.push(santa);

        // TODO remove test elf
        for (let i = 0; i < 666; i++) {
            let elf = new Elf("../rc/elf.png", 3, 4);
            elf.x = random(0, this.canvas.width);
            elf.y = random(0, this.canvas.height);
            this.entities.push(elf);
        }

        // map of every keys currently pressed
        this.keys = [];

        // timing attributes
        this.previousTime = Date.now();
    }

    start() {
        const FRAMETIME = 1000 / 60;
        this.interval = setInterval(this.update.bind(this), FRAMETIME);

        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            this.keys[e.keyCode] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.keyCode] = false;
        })
    }

    update() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.previousTime;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBG();

        this.entities.forEach((e) => {
            e.update(elapsedTime, this.keys, this.canvas.width, this.canvas.height);
            e.draw(this.context);
        });

        this.previousTime = currentTime;
    }

    stop() {
        clearInterval(this.interval);
    }

    /**
     * Draws a background with the "snow.png" image on the game canvas.
     */
    drawBG() {
        this.context.fillStyle = this.context.createPattern(this.bg, 'repeat');
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}