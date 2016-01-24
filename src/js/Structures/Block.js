export default class Block {
    /**
     * Constructor of the Basic Block Object
     * @param game - Phaser Game Object
     * @param bottomLine - Handler to the bottom line
     * @param boardConfig - Configuration of the object
     * @param posX - starting position X (in size of board)
     * @param posY - starting position Y (in size of board)
     * @param blockType - object with the block setup details
     */
    constructor(game, bottomLine, boardConfig, posX, posY, blockType) {

        this.blockConfig = {
            rolling: true,
            rollingLock: false,
            delayLock: true,
            pulledDown: false,
            pulledDownLock: false
        };
        this.type = blockType;
        this.boardConfig = boardConfig;
        this.posX = posX;
        this.posY = Math.floor((bottomLine._sprite.y - boardConfig.startY()) / boardConfig.boxSize());
        this._bottomLine = bottomLine;
        var blockTmp = game.add.graphics(0, 0);
        blockTmp.beginFill(blockType.color, 1);
        blockTmp.bounds = new PIXI.Rectangle(0, 0, boardConfig.boxSize(), boardConfig.boxSize());
        blockTmp.drawRect(0, 0, boardConfig.boxSize(), boardConfig.boxSize());
        blockTmp.boundsPadding = 0;
        this._sprite = game.add.sprite(boardConfig.boxPosX(posX), boardConfig.boxPosY(posY), blockTmp.generateTexture());
        blockTmp.destroy();
        game.physics.arcade.enable(this._sprite);
        this._sprite.body.velocity.y = 0;
        this._sprite.anchor.y = 1;
        this._sprite.anchor.x = 0;
        this.thowDelay();
        this.fillBottom = this._bottomLine._sprite.y;
        this.boxSized = Math.floor(this.boardConfig.boxSizeM())

    }

    /**
     * Moves Block right if it is possible
     * @returns {boolean} true is moved, false if cannot move
     */
    moveRight() {
        if (this.canMoveRight()) {
            this.posX = this.posX + 1;
            this._sprite.x = this.boardConfig.boxPosX(this.posX);
            return true;
        }
        return false;
    }

    /**
     * Moves Block left if it is possible
     * @returns {boolean} true is moved, false if cannot move
     */
    moveLeft() {
        if (this.canMoveLeft()) {
            this.posX = this.posX - 1;
            this._sprite.x = this.boardConfig.boxPosX(this.posX);
            return true;
        }
        return false;
    }

    /**
     * Check if object can be moved into right
     * @returns {boolean} true if can, false if cannot
     */
    canMoveRight() {
        return !this.blockConfig.rollingLock && this.posX + 1 < this.boardConfig.boardSize() - 1 && this.fillBottom - this.boardConfig.board.arrayFills[this.posX + 1] * this.boxSized > Math.floor(this._sprite.y);
    }

    /**
     * Check if object can be moved into left
     * @returns {boolean} true if can, false if cannot
     */
    canMoveLeft() {
        return !this.blockConfig.rollingLock && this.posX - 1 >= 0 && this.fillBottom - this.boardConfig.board.arrayFills[this.posX - 1] * this.boxSized > Math.floor(this._sprite.y);
    }

    pullDown() {
        if (this.blockConfig.pulledDownLock == false) {
            this.blockConfig.pulledDownLock = true;
        }
    }

    getType() {
        return this.type;
    }

    isRolling() {
        return this.blockConfig.rolling;
    }

    setPosition(x, y) {
        this._sprite.x = x;
        this._sprite.y = y;
    }

    thowDelay() {
        setTimeout(()=> {
            this.blockConfig.delayLock = false;
        }, this.boardConfig.throwDelayDuration());
    }

    updateCoords() {
        if (this.blockConfig.rolling == true && (!this.blockConfig.delayLock || this.blockConfig.pulledDownLock)) {
            if (this.blockConfig.pulledDownLock) {
                this._sprite.body.velocity.y = this.boardConfig.pullDownSpeed();
            } else {
                this._sprite.body.velocity.y = this.boardConfig.blockSpeed();
            }
            this.checkHitGround();
        } else if (this.blockConfig.rolling == false) {
            this._sprite.y = Math.floor(this.fillBottom - (this.boardConfig.board.arrayFills[this.posX]) * this.boxSized - 1);
        }
    }

    checkHitGround() {
        var calculatedPos = Math.ceil((this.fillBottom - Math.floor(this._sprite.y)) / this.boxSized);// Math.floor(this.fillBottom - (this.boardConfig.boardFills[this.posX]) * this.boxSized);
        if (Math.floor(this._sprite.y) >= Math.floor(this.fillBottom - (this.boardConfig.board.arrayFills[this.posX]) * this.boxSized)) {
            this._sprite.body.velocity.y = 0;
            this.blockConfig.rolling = false;
            this._sprite.y = Math.floor(this.fillBottom - (this.boardConfig.board.arrayFills[this.posX]) * this.boxSized - 1);
            this.blockConfig.rollingLock = true;
            this._sprite.body.moves = false;
            this.posY = calculatedPos;
            this.boardConfig.board.setGround(this.posX, calculatedPos, this);
        }
    }

    setBigCoords(x, y) {
        this._sprite.y = y;
        this._sprite.x = x;
        this.posY = Math.floor((this._bottomLine._sprite.y + this.boardConfig.startY() - this._sprite.y) / this.boardConfig.boxSizeM());
        this.posX = Math.floor((this._sprite.x - this.boardConfig.insideStartX()) / this.boardConfig.boxSizeM());
    }

    lockToRemove() {
        this._sprite.alpha = 0.7;
        this.status = 1;
    }

    lockToDestroy() {
        this._sprite.alpha = 0.2;
        this.status = 2;
    }

    isLocked() {
        return this.status == 1;
    }

    isDestroyed() {
        return this.status == 2;
    }

    rollAgain() {
        this.blockConfig = {
            rolling: true,
            rollingLock: false,
            delayLock: false,
            pulledDown: true,
            pulledDownLock: true,
            rolledAgain: true
        };
        this._sprite.body.moves = true;
    }
}