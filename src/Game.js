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
        this.santa = new Entity("../rc/santa.png", 3, 4);

        // all the Entity managed in the game
        this.entities = [];
        this.entities.push(this.santa);

        // map of every keys currently pressed
        this.keys = [];
    }

    start() {
        this.interval = setInterval(this.update.bind(this), FRAMERATE);

        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            this.keys[e.keyCode] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.keyCode] = false;
        })
    }

    update() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBG();

        this.entities.forEach((e) => {
            e.update(this.keys, this.canvas.width, this.canvas.height);
            e.draw(this.context);
        });
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