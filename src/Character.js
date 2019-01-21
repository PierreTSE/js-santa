class Character extends Entity {
    /**
     * {@link Entity#constructor}
     */
    constructor(spriteSource, nX, nY, horatio) {
        super(spriteSource, nX, nY, horatio);

        // sprite selection attributes
        this.orientation = 2;

        // gameplay attributes
        this.speed = 0; // default speed
    }

    /**
     * Moves the sprite by the given deltas.
     * @param dx x value to move
     * @param dy y value to move
     * @param canvasWidth Width of the game canvas
     * @param canvasHeight Height of the game canvas
     */
    move(dx, dy, canvasWidth, canvasHeight) {
        this.x = clamp(this.x + dx, 0, canvasWidth - this.spriteWidth * this.horatio);
        this.y = clamp(this.y + dy, 0, canvasHeight - this.spriteHeight * this.horatio);
    }

    /**
     * Draws the Character sprite on the given context.
     * @param context The context to draw onto.
     */
    draw(context) {
        const sx = this.spriteWidth * 1; //TODO implémenter animation
        const sy = this.spriteHeight * (this.orientation - 1);
        context.drawImage(this.spritesheet, sx, sy, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth * this.horatio, this.spriteHeight * this.horatio);
    }
}