class Santa extends AnimatedEntity {
    /**
     * Constructor of Santa.
     */
    constructor() {
        super("../rc/santa.png", 3, 4, 0.5);

        // gameplay attributes
        this.speed = 0.2;

        this.euro = 100;
        this.gift = 100;

        this.isIntangible = false;
        this.INTANGIBILITY_TIME = 500; // ms of intangibility after having been hit
        this.intangibilityTime = 0;
    }

    /**
     * Updates the orientation and the position of the sprite according to the currently pressed keys.
     * @param elapsedTime the time between this frame and the previous one
     * @param keys Map where the currently pressed keys are set to true.
     * @param canvasWidth Width of the game canvas
     * @param canvasHeight Height of the game canvas
     */
    update(elapsedTime, keys, canvasWidth, canvasHeight) {
        if (!Array.isArray(keys)) {
            throw new Error("IllegalArgument : keys must ba an array of currently pressed keys");
        }

        if (this.isIntangible) {
            this.intangibilityTime += elapsedTime;
            if (this.intangibilityTime >= this.INTANGIBILITY_TIME) {
                this.isIntangible = false;
            }
        }

        if (keys.length !== 0) {

            let left = (typeof keys[37] === "undefined" ? false : keys[37]),
                up = (typeof keys[38] === "undefined" ? false : keys[38]),
                right = (typeof keys[39] === "undefined" ? false : keys[39]),
                down = (typeof keys[40] === "undefined" ? false : keys[40]);

            if (up && down) {
                up = false;
                down = false;
            }
            if (left && right) {
                left = false;
                right = false;
            }

            if (!up && !down && !left && !right) {
                this.animationState = 1;
                this.timeSincePreviousAnimation = 0;
                return;
            }

            this.updateAnimation(elapsedTime);

            if (up) {
                this.orientation = 1;
            } else if (down) {
                this.orientation = 3;
            }

            if (left) {
                this.orientation = 4;
            } else if (right) {
                this.orientation = 2;
            }

            const nb = (up | 0) + (down | 0) + (left | 0) + (right | 0);

            this.move((((right | 0) - (left | 0)) * this.speed) / Math.sqrt(nb) * elapsedTime,
                ((down | 0) - (up | 0)) * this.speed / Math.sqrt(nb) * elapsedTime,
                canvasWidth,
                canvasHeight);
        }
    }

    /**
     * Updates state when having been hit.
     *
     * @param x abscissa of the Entity which hit Santa
     * @param y ordinate of the Entity which hit Santa
     * @param canvasWidth Width of the game canvas
     * @param canvasHeight Height of the game canvas

     */
    gotHit(x, y, canvasWidth, canvasHeight) {
        this.euro -= 5;
        this.isIntangible = true;
        this.intangibilityTime = 0;

        // too complicated for now
        // const knockbackDist = 50; // in px
        //
        // if (this.x < x) {
        //     this.move(-knockbackDist, 0, canvasWidth, canvasHeight);
        // } else {
        //     this.move(knockbackDist, 0, canvasWidth, canvasHeight);
        // }
        //
        // if (this.y < y) {
        //     this.move(0, -knockbackDist, canvasWidth, canvasHeight);
        // } else {
        //     this.move(0, knockbackDist, canvasWidth, canvasHeight);
        // }
    }
}