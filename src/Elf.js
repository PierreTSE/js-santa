class Elf extends AnimatedEntity {
    /**
     * Constructor of Elf.
     */
    constructor() {
        super("../rc/images/elf2.png", 3, 4, 1);

        // gameplay attributes
        this.speed = 0.07;
        this.isStunned = false;
        this.STUN_TIME = 15000; // ms

        // elf IA attributes
        this.REORIENTATE_CHANCE = 0.7; // chance to reorientate if he can
        this.wantsToReorientate = true; // if he currently wants to change direction
        this.MIN_TIME_BEFORE_REORIENTATE = 200;
        this.MAX_TIME_BEFORE_REORIENTATE = 700;
        this.walkingPeriod = randint(this.MIN_TIME_BEFORE_REORIENTATE, this.MAX_TIME_BEFORE_REORIENTATE); // minimal time in ms before the elf changes direction

        // current virtual inputs
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;

        // animation must be started for IA
        this.animationState = 0;
    }

    /**
     * Updates the orientation and the position of the sprite.
     * @param elapsedTime the time between this frame and the previous one
     * @param keys Unused for an Elf.
     * @param canvasWidth Width of the game canvas
     * @param canvasHeight Height of the game canvas
     */
    update(elapsedTime, keys, canvasWidth, canvasHeight) {

        if (this.isStunned) {
            this.stunTime += elapsedTime;
            if (this.stunTime >= this.STUN_TIME) {
                this.isStunned = false;
            }
        }
        else if (this.wantsToReorientate) {
            this.resetInputs();

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
                    throw new Error("Default case reached");
            }

            this.wantsToReorientate = false;
            this.timeSpentInThisOrientation = 0;
        }
        else {
            this.timeSpentInThisOrientation += elapsedTime;

            if (this.timeSpentInThisOrientation >= this.walkingPeriod) {
                // this part prevents elves to come too close to the border of the canvas
                const minDistToBorder = 10; // in px
                if (this.y < minDistToBorder) {
                    this.resetInputs();
                    this.down = true;
                    this.orientation = 3;
                    this.timeSpentInThisOrientation = 0;
                }
                else if (this.y + this.HEIGHT > canvasHeight - minDistToBorder) {
                    this.resetInputs();
                    this.up = true;
                    this.orientation = 1;
                    this.timeSpentInThisOrientation = 0;
                }

                if (this.x < minDistToBorder) {
                    this.resetInputs();
                    this.right = true;
                    this.orientation = 2;
                    this.timeSpentInThisOrientation = 0;
                }
                else if (this.x + this.WIDTH > canvasWidth - minDistToBorder) {
                    this.resetInputs();
                    this.left = true;
                    this.orientation = 4;
                    this.timeSpentInThisOrientation = 0;
                }
            }

            if (this.timeSpentInThisOrientation >= this.walkingPeriod) {
                // this part reorientates with a random chance after a period of walking
                if (Math.random() < this.REORIENTATE_CHANCE) {
                    this.wantsToReorientate = true;
                }
                else {
                    this.timeSpentInThisOrientation = 0;
                }

                this.walkingPeriod = randint(this.MIN_TIME_BEFORE_REORIENTATE, this.MAX_TIME_BEFORE_REORIENTATE);
            }

            // actual movement according to current inputs
            const nb = (this.up | 0) + (this.down | 0) + (this.left | 0) + (this.right | 0);

            if (nb === 0) { // no inputs, stays in place
                this.animationState = 1;
                this.timeSincePreviousAnimation = 0;
                return;
            }

            this.updateAnimation(elapsedTime);

            this.move((((this.right | 0) - (this.left | 0)) * this.speed) / Math.sqrt(nb) * elapsedTime,
                ((this.down | 0) - (this.up | 0)) * this.speed / Math.sqrt(nb) * elapsedTime,
                canvasWidth,
                canvasHeight);

        }
    }

    resetInputs() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
    }

    stun() {
        this.stunTime = 0;
        this.isStunned = true;
    }
}