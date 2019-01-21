class UnanimatedEntity extends Entity {
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
     * Draws the AnimatedEntity sprite on the given context.
     * @param context The context to draw onto.
     */
    draw(context) {
        // TODO draw
        // const sx = this.spriteWidth * 1; //TODO implémenter animation
        // const sy = this.spriteHeight * (this.orientation - 1);
        // context.drawImage(this.spritesheet, sx, sy, this.spriteWidth, this.spriteHeight, this.x, this.y, this.WIDTH, this.HEIGHT);
    }

}