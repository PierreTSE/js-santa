class Tree extends UnanimatedEntity {
    /**
     * {@link Entity#constructor}
     */
    constructor(spriteSource, nX, nY, horatio, canvasWidth, canvasHeight) {
        super(spriteSource, nX, nY, horatio, 1);

        this.spritesheet.addEventListener("load", () => {
            this.x = random(0, canvasWidth - this.WIDTH);
            this.y = random(0, canvasHeight - this.HEIGHT);
        });

        this.isAlive = true;
        this.lifeTime = 0;
    }

    update(elapsedTime) {
        this.lifeTime += elapsedTime;
    }
}