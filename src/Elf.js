class Elf extends Character {
    /**
     * {@link Entity#constructor}
     */
    constructor(spriteSource, nX, nY, horatio) {
        super(spriteSource, nX, nY, horatio);

        // gameplay attributes
        this.speed = 0.05;
        this.isStunned = false;

        // elf IA attributes
        this.REORIENTATE_CHANCE = 0.7; // chance to reorientate if he can
        this.wantsToReorientate = true; // if he currently wants to change direction
        this.MIN_TIME_BEFORE_REORIENTATE = 200;
        this.MAX_TIME_BEFORE_REORIENTATE = 700;
        this.timeBeforeReorientate = randint(this.MIN_TIME_BEFORE_REORIENTATE, this.MAX_TIME_BEFORE_REORIENTATE); // minimal time in ms before the elf changes direction

        // current virtual inputs
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
    }

    /**
     * Updates the orientation and the position of the sprite.
     * @param elapsedTime the time between this frame and the previous one
     * @param keys Unused for an Elf.
     * @param canvasWidth Width of the game canvas
     * @param canvasHeight Height of the game canvas
     */
    update(elapsedTime, keys, canvasWidth, canvasHeight) {

        if (this.wantsToReorientate) {
            this.up = false;
            this.down = false;
            this.left = false;
            this.right = false;

            switch (randint(0, 8)) {
                case 0:
                    break; // elf stays in place
                case 1:
                    this.up = true;
                    this.orientation = 1;
                    break;
                case 2:
                    this.up = true;
                    this.right = true;
                    this.orientation = 2;
                    break;
                case 3:
                    this.right = true;
                    this.orientation = 2;
                    break;
                case 4:
                    this.right = true;
                    this.down = true;
                    this.orientation = 2;
                    break;
                case 5:
                    this.down = true;
                    this.orientation = 3;
                    break;
                case 6:
                    this.left = true;
                    this.down = true;
                    this.orientation = 4;
                    break;
                case 7:
                    this.left = true;
                    this.orientation = 4;
                    break;
                case 8:
                    this.up = true;
                    this.left = true;
                    this.orientation = 4;
                    break;
                default:
                    throw new Error("Default cas reached");
            }

            this.wantsToReorientate = false;
            this.timeSpentInThisOrientation = 0;
        }
        else {
            this.timeSpentInThisOrientation += elapsedTime;
            if (this.timeSpentInThisOrientation >= this.timeBeforeReorientate) {
                if (Math.random() < this.REORIENTATE_CHANCE) {
                    this.wantsToReorientate = true;
                }
                else {
                    this.timeSpentInThisOrientation = 0;
                }

                this.timeBeforeReorientate = randint(this.MIN_TIME_BEFORE_REORIENTATE, this.MAX_TIME_BEFORE_REORIENTATE);
            }
        }

        // actual movement according to current inputs
        const nb = (this.up | 0) + (this.down | 0) + (this.left | 0) + (this.right | 0);

        if (nb === 0)
            return;

        this.move((((this.right | 0) - (this.left | 0)) * this.speed) / Math.sqrt(nb) * elapsedTime,
            ((this.down | 0) - (this.up | 0)) * this.speed / Math.sqrt(nb) * elapsedTime,
            canvasWidth,
            canvasHeight);
    }
}