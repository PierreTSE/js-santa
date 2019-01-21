class BadTree extends Tree {
    /**
     * {@link Entity#constructor}
     */
    constructor(spriteSource, nX, nY, horatio) {
        super("../rc/bad_tree.png", 2, 1, 1);

        this.LONGEVITY = 20000; // in ms
        this.SPAWNED_ELVES = 1;
        this.TAKEN_GIFTS = 5;
    }
}