class GoodTree extends Tree {
    /**
     * {@link Entity#constructor}
     */
    constructor(canvasWidth, canvasHeight) {
        super("../rc/images/good_tree.png", 4, 1, 1, canvasWidth, canvasHeight);

        this.LONGEVITY = 10000; // in ms
        this.SPAWNED_ELVES = 2;
        this.TAKEN_GIFTS = 10;
    }
}