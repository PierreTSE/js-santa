class Ball extends UnanimatedEntity {
    /**
     * {@link Entity#constructor}
     */
    constructor(canvasWidth, canvasHeight) {
        super("../rc/images/smallball.png", 1, 1, 1, 1);

        this.sound = new Audio("../rc/audio/audi-famem.mp3");

        this.spritesheet.addEventListener("load", () => {
            this.x = random(0, canvasWidth - this.WIDTH);
            this.y = random(0, canvasHeight - this.HEIGHT);
        });

        this.isAlive = true;
    }
}