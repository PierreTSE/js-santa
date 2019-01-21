class BadTree extends Tree {
    /**
     * {@link Entity#constructor}
     */
    constructor(canvasWidth, canvasHeight) {
        super("../rc/images/bad_tree.png", 2, 1, 1, canvasWidth, canvasHeight);

        this.LONGEVITY = 20000; // in ms
        this.SPAWNED_ELVES = 1;
        this.TAKEN_GIFTS = 5;
    }
}