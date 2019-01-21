class Tree extends UnanimatedEntity {
    /**
     * {@link Entity#constructor}
     */
    constructor(spriteSource, nX, nY, horatio) {
        super("../rc/good_tree.png", 4, 1, 1);

        this.isAlive = true;
        this.lifeTime = 0;
    }

    update(elapsedTime) {
        this.lifeTime += elapsedTime;
    }
}