class AnimatedEntity extends Entity {
    /**
     * {@link Entity#constructor}
     */
    constructor(spriteSource, nX, nY, horatio) {
        super(spriteSource, nX, nY, horatio);

        // sprite selection attributes
        /**
         * 0 : walking 1
         * 1 : idle
         * 2 : walkind 2
         */
        this.animationState = 1;

        // gameplay attributes
        this.speed = 0; // default speed

        // animation attributes
        this.ANIMATION_FRAMETIME = function () {
            return this.speed * 1000; // in ms
        };
        this.timeSincePreviousAnimation = 0;
    }

    /**
     * Must be called by every implementation of #update
     */
    updateAnimation(elapsedTime) {
        this.timeSincePreviousAnimation += elapsedTime;
        if (this.timeSincePreviousAnimation >= this.ANIMATION_FRAMETIME()) {
            switch (this.animationState) {
                case 0:
                case 2:
                    this.previousAnimatedState = this.animationState;
                    this.animationState = 1;
                    this.timeSincePreviousAnimation = 0;
                    break;
                case 1:
                    switch (this.previousAnimatedState) {
                        case 0:
                            this.animationState = 2;
                            this.timeSincePreviousAnimation = 0;
                            break;
                        case 2:
                            this.animationState = 0;
                            this.timeSincePreviousAnimation = 0;
                            break;
                        default:
                            this.previousAnimatedState = 0;
                            break;
                    }
                    break;
                default:
                    throw new Error("Default case reached for this.animationState");
            }
        }
    }

    /**
     * Draws the AnimatedEntity sprite on the given context.
     * @param context The context to draw onto.
     */
    draw(context) {
        const sx = this.spriteWidth * this.animationState;
        const sy = this.spriteHeight * (this.orientation - 1);
        context.drawImage(this.spritesheet, sx, sy, this.spriteWidth, this.spriteHeight, this.x, this.y, this.WIDTH, this.HEIGHT);
    }
}