class Tree extends UnanimatedEntity {
    /**
     * {@link Entity#constructor}
     */
    constructor(spriteSource, nX, nY, horatio, canvasWidth, canvasHeight) {
        super(spriteSource, nX, nY, horatio, 1);

        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.isAlive = true;
        this.lifeTime = 0;
    }

    update(elapsedTime) {
        this.lifeTime += elapsedTime;
    }

    setRandomPosition() {
        this.x = random(0, this.canvasWidth - this.WIDTH);
        this.y = random(0, this.canvasHeight - this.HEIGHT);
    }
}