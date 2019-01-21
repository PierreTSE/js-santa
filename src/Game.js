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

        // TODO remove test elf
        for (let i = 0; i < 15; i++) {
            let elf = new Elf();
            elf.x = random(0, this.canvas.width - 40);
            elf.y = random(0, this.canvas.height - 40);
            this.aEntities.push(elf);
        }

        // map of every keys currently pressed
        this.keys = [];

        // timing general attributes
        this.lifeTime = 0;
        this.GAMETIME = 210000; // 3:30 game
        this.previousTime = Date.now();

        // tree spawning
        this.timeSincePreviousBlossom = 0;
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
            } else {
                // spawn good tree
                tree = new GoodTree(this.canvas.width, this.canvas.height);
            }

            tree.spritesheet.addEventListener("load", () => {
                // this part sets a new random position to the tree while it is overlapping with another one
                let isInGoodPos;
                let tries = 0;
                let MAX_TRIES = 10000;
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

        // collision and endgame checking
        this.collideSanta();
        if (this.santa.euro <= 0 || (this.GAMETIME - this.lifeTime) <= 0) {
            this.stop();
            this.gameOver();
            return;
        }

        // renders the canvas
        this.draw(elapsedTime);
    }

    draw(elapsedTime) {
        // redraw background
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.context.createPattern(this.bg, 'repeat');
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

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

    collideSanta() {
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
                    this.santa.gift -= collidingEntity.TAKEN_GIFTS;
                    this.uaEntities.splice(i, 1);
                    currentUAEntitiesLength--;
                }
                // TODO Ball here
                else {
                    throw new Error("Can't determine type of colliding entity.");
                }
            }
        }
    }

    gameOver() {
        this.draw(0);
        this.context.fillStyle = "#000000";
        const gameOverText = "Vous avez perdu !";
        this.context.fillText(gameOverText, (this.canvas.width - this.context.measureText(gameOverText).width) / 2, this.canvas.height / 2);
    }

    stop() {
        clearInterval(this.interval);
    }
}