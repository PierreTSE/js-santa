class Game {
    constructor(canvas) {
        if (!(canvas instanceof HTMLElement) || !(canvas.nodeName === "CANVAS")) {
            throw new Error("IllegalArgument : canvas must be a <canvas>")
        }

        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");

        // canvas attributes
        this.context.font = "bold 30px Arial";

        // background image
        this.bg = new Image();
        this.bg.src = "../rc/images/snow2.jpg";

        // all the Entity managed in the game
        this.aEntities = []; // animated entities
        this.uaEntities = []; // unanimated entities

        // all the Entity managed in the game
        this.entities = [];
        this.entities.push(this.santa);

        // player santa
        this.santa = new Santa();
        this.aEntities.push(this.santa);

        // Starts with some elves at beginning.
        const IMIN_TATA_ENEL = 0;
        this.spawnElves(IMIN_TATA_ENEL);

        // map of every keys currently pressed
        this.keys = [];

        // timing general attributes
        this.lifeTime = 0;
        this.GAMETIME = 210000; // 3:30 game
        this.previousTime = Date.now();

        // tree spawning
        this.timeSincePreviousBlossom = 100001; // > TIME_BETWEEN_BLOSSOM to make a tree spawn at start
        this.TIME_BETWEEN_BLOSSOM = 10000;

        // debug infos
        this.DEBUG_MODE = true;
    }

    start() {
        const FPS = 60;
        this.interval = setInterval(this.update.bind(this), 1000 / FPS);

        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            this.keys[e.keyCode] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.keyCode] = false;
        })
    }

    update() {
        // timing management
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.previousTime;
        this.lifeTime += elapsedTime;
        this.timeSincePreviousBlossom += elapsedTime;
        this.previousTime = currentTime;


        // spawns a tree if it is time
        if (this.timeSincePreviousBlossom >= this.TIME_BETWEEN_BLOSSOM) {
            this.timeSincePreviousBlossom = 0;
            let tree;
            if (Math.random() < 0.7) {
                // spawn bad tree
                tree = new BadTree(this.canvas.width, this.canvas.height);
                this.spawnElves(1); // bad tree summons 1 elf
            } else {
                // spawn good tree
                tree = new GoodTree(this.canvas.width, this.canvas.height);
                this.spawnElves(2); // good tree summons 2 elf
            }

            tree.spritesheet.addEventListener("load", () => {
                // this part sets a new random position to the tree while it is overlapping with another one
                let isInGoodPos;
                let tries = 0;
                const MAX_TRIES = 10000;
                do {
                    tree.setRandomPosition();
                    isInGoodPos = true;
                    for (let i in this.uaEntities) {
                        if (intersects(tree.x, tree.y, tree.WIDTH, tree.HEIGHT, this.uaEntities[i].x, this.uaEntities[i].y, this.uaEntities[i].WIDTH, this.uaEntities[i].HEIGHT)) {
                            isInGoodPos = false;
                            break;
                        }
                    }

                    if (++tries === MAX_TRIES) {
                        break;
                    }

                } while (!isInGoodPos);

                // blossom the tree
                if (tries < MAX_TRIES) {
                    this.uaEntities.push(tree);
                }
                else {
                    console.warn("Tree could not be created because of missing place in game area.");
                }
            });
        }

        // update every Entity
        this.aEntities.forEach((ae) => {
            ae.update(elapsedTime, this.keys, this.canvas.width, this.canvas.height);
        });

        this.uaEntities.forEach((ue) => {
            ue.update(elapsedTime, this.keys, this.canvas.width, this.canvas.height);
        });

        // collision
        for (let i = 1; i < this.aEntities.length; ++i) {
            if (intersects(this.santa.x, this.santa.y, this.santa.WIDTH, this.santa.HEIGHT, this.aEntities[i].x, this.aEntities[i].y, this.aEntities[i].WIDTH, this.aEntities[i].HEIGHT)) {
                const collidingEntity = this.aEntities[i];
                if (!this.santa.isIntangible && collidingEntity instanceof Elf) {
                    this.santa.gotHit(this.aEntities[i].x, this.aEntities[i].y, this.canvas.width, this.canvas.height);
                }
            }
        }

        let currentUAEntitiesLength = this.uaEntities.length;
        for (let i = 0; i < currentUAEntitiesLength; i++) {
            if (intersects(this.santa.x, this.santa.y, this.santa.WIDTH, this.santa.HEIGHT, this.uaEntities[i].x, this.uaEntities[i].y, this.uaEntities[i].WIDTH, this.uaEntities[i].HEIGHT)) {
                const collidingEntity = this.uaEntities[i];
                if (collidingEntity instanceof BadTree || collidingEntity instanceof GoodTree) {
                    this.santa.gift -= collidingEntity.TAKEN_GIFTS; // here number
                    if (this.santa.gift <= 0) {
                        this.stop();
                        this.gameOver("Vous avez gagné !", "Il vous restait " + this.santa.euro + " euros.");
                        return;
                    }
                    this.uaEntities.splice(i, 1);
                    currentUAEntitiesLength--;
                }
                // TODO Ball here
                else {
                    throw new Error("Can't determine type of colliding entity.");
                }
            }
        }

        // unroot dead trees (remove !isAlive trees from memory)
        currentUAEntitiesLength = this.uaEntities.length;
        for (let i = 0; i < currentUAEntitiesLength; i++) {
            if (!this.uaEntities[i].isAlive) {
                this.uaEntities.splice(i, 1);
                currentUAEntitiesLength--;
            }
        }

        // endgame checking
        if (this.santa.euro <= 0 || (this.GAMETIME - this.lifeTime) <= 0) { // no euros
            this.stop();
            this.gameOver("Vous avez perdu !", "Il vous restait " + this.santa.gift + " cadeaux.");
            return;
        }

        // renders the canvas
        this.draw(elapsedTime);
    }

    draw(elapsedTime) {
        // redraw background
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBG();

        // draw every entity
        this.aEntities.forEach((e) => {
            e.draw(this.context);
        });

        this.uaEntities.forEach((e) => {
            e.draw(this.context);
        });

        // display chronometer
        this.context.fillStyle = "#000000";
        this.context.fillText(s2mmss((this.GAMETIME - this.lifeTime) / 1000), 5, 30);

        // display gifts and euros
        this.context.fillText("Euros : " + this.santa.euro.toString(), 280, 30);
        this.context.fillText("Cadeaux : " + this.santa.gift.toString(), 580, 30);


        // debug infos
        if (this.DEBUG_MODE) {
            this.context.fillText(s2mmss(this.lifeTime / 1000), 5, this.canvas.height - 50);
            this.context.fillText("FPS : " + (1000 / elapsedTime).toFixed(2), 5, this.canvas.height - 15);
        }
    }

    /**
     * Draws the texts in parameter in the center of the canvas.
     * @param gameOverText1 first line of text.
     * @param gameOverText2 second line of text..
     */
    gameOver(gameOverText1, gameOverText2) {
        // redraw background
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBG();

        const yShift = 20;

        this.context.fillStyle = "#000000";
        this.context.fillText(gameOverText1, (this.canvas.width - this.context.measureText(gameOverText1).width) / 2, this.canvas.height / 2 - yShift);
        this.context.fillText(gameOverText2, (this.canvas.width - this.context.measureText(gameOverText2).width) / 2, this.canvas.height / 2 + yShift);
    }

    /**
     * Stops the game.
     */
    stop() {
        clearInterval(this.interval);
    }

    /**
     * Renders the background on the canvas.
     */
    drawBG() {
        // redraw background
        this.context.fillStyle = this.context.createPattern(this.bg, 'repeat');
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    }

    /**
     * Spawns the given number of Elf in a random position.
     * @param n the number of Elf to spawn.
     */
    spawnElves(n) {
        for (let i = 0; i < n; i++) {
            let elf = new Elf();
            elf.spritesheet.addEventListener("load", () => {
                elf.x = random(0, this.canvas.width - elf.WIDTH);
                elf.y = random(0, this.canvas.height - elf.HEIGHT);
                this.aEntities.push(elf);
            });
        }
    }
}