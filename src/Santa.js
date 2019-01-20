class Santa extends Entity{
    /**
     * Updates the orientation and the position of the sprite according to the currently pressed keys.
     * @param keys Map where the currently pressed keys are set to true.
     * @param canvasWidth Width of the game canvas
     * @param canvasHeight Height of the game canvas
     */
    update(keys, canvasWidth, canvasHeight) {
        if (!Array.isArray(keys)) {
            throw new Error("IllegalArgument : keys must ba an array of currently pressed keys");
        }

        this.isMoving = false;

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
                this.isMoving = false;
                return;
            }

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

            this.isMoving = true;
            this.move((((right | 0) - (left | 0)) * this.speed) / Math.sqrt(nb) * FRAMETIME,
                ((down | 0) - (up | 0)) * this.speed / Math.sqrt(nb) * FRAMETIME,
                canvasWidth,
                canvasHeight);
        }
    }
}