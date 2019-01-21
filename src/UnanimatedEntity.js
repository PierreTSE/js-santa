class UnanimatedEntity extends Entity {
    /**
     * {@link Entity#constructor}
     */
    constructor(spriteSource, nX, nY, horatio) {
        super(spriteSource, nX, nY, horatio);
        this.spriteShift=randint(0, nX-1); //choose one sprite among the possible ones

    }


    /**
     * Draws the AnimatedEntity sprite on the given context.
     * @param context The context to draw onto.
     */
    draw(context) {
        // TODO draw
         context.drawImage(this.spritesheet, this.spriteShift*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.WIDTH, this.HEIGHT);
    }

}