class Entity {
    /**
     * Constructs the Entity.
     * @param spriteSource string : relative value to the spritesheet of the Entity
     * @param nX The number of sprites in a row of the spritesheet
     * @param nY The number of sprites in a column of the spritesheet
     * @param horatio ratio at which the sprite is resized before rendering
     */
    constructor(spriteSource, nX, nY, horatio = 1) {
        if (typeof spriteSource !== "string" || spriteSource.length === 0) {
            throw new Error("IllegalArgument : spriteSource.");
        }
        if (typeof nX !== "number") {
            throw new Error("IllegalArgument : nX must be a number.");
        } else if (nX <= 0) {
            throw new Error("IllegalArgument : nX must be strictly positive.");
        }
        if (typeof nY !== "number") {
            throw new Error("IllegalArgument : nY must be a number.");
        } else if (nY <= 0) {
            throw new Error("IllegalArgument : nY must be strictly positive.");
        }
        if (typeof horatio !== "number") {
            throw new Error("IllegalArgument : horatio must be a number.");
        } else if (horatio <= 0) {
            throw new Error("IllegalArgument : horatio must be strictly positive.");
        }

        // spritesheet and dimensions of one sprite
        this.spritesheet = new Image();
        this.spritesheet.src = spriteSource;
        this.spritesheet.addEventListener("load", () => {
            this.spriteWidth = this.spritesheet.width / nX;
            this.spriteHeight = this.spritesheet.height / nY;

            // actual rendered dimensions
            this.WIDTH = this.spriteWidth * this.HORATIO;
            this.HEIGHT = this.spriteHeight * this.HORATIO;
        });

        // ratio at which the sprite is resized before rendering
        this.HORATIO = horatio;

        // coordinates of the top-left corner
        this.x = 0;
        this.y = 0;

        // sprite selection attributes
        /**
         * 1 : up
         * 2 : right
         * 3 : down
         * 4 : left
         */
        this.orientation = 2;
    }

    /**
     * Moves the sprite by the given deltas.
     * @param dx x value to move
     * @param dy y value to move
     * @param canvasWidth Width of the game canvas
     * @param canvasHeight Height of the game canvas
     */
    move(dx, dy, canvasWidth, canvasHeight) {
        this.x = clamp(this.x + dx, 0, canvasWidth - this.WIDTH);
        this.y = clamp(this.y + dy, 0, canvasHeight - this.HEIGHT);
    }
}