class GoodTree extends Tree {
    /**
     * {@link Entity#constructor}
     */
    constructor(spriteSource, nX, nY, horatio) {
        super("../rc/good_tree.png", 4, 1, 1);

        this.LONGEVITY = 10000; // in ms
        this.SPAWNED_ELVES = 2;
        this.TAKEN_GIFTS = 10;
    }
}