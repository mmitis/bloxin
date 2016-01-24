export default class ProgressLine {
    constructor(game, boardConfig){
        this.boardConfig = boardConfig;
        let tmpLine = game.add.graphics(0, 0);
        tmpLine.lineStyle(10, 0xc0392b, 1);
        tmpLine.moveTo(0,0);
        tmpLine.lineTo(0, this.boardConfig.insideHeight());
        tmpLine.boundsPadding = 0;
        this._direction = true;
        this._sprite = game.add.sprite(0, 30, tmpLine.generateTexture());
        tmpLine.destroy();
        game.physics.arcade.enable(this._sprite);
        this._sprite.body.velocity.x = this.boardConfig.barSpeed();
        this.removeLocks = [];
        this.lastIndex = 0;
        this.currentIndex = 0;
        this.lastQueue = 0;
    }

    updateCoords(){
        var self = this;
        var currentRow = Math.floor((this._sprite.x - this.boardConfig.insideStartX())/this.boardConfig.boxSizeM());
        this._sprite.bringToTop();
        if(this._sprite.x > this.boardConfig.insideEndX() && this._direction == true){
            this._direction = false;
            this.clearRemoveQueue();
            this._sprite.body.velocity.x = -1 * this.boardConfig.barSpeed();
        } else if(this._sprite.x < this.boardConfig.insideStartX()){
            this._direction = true;
            this.clearRemoveQueue();
            this._sprite.body.velocity.x = this.boardConfig.barSpeed();
        }


        if(this.boardConfig.board.arrayBlocks[currentRow]) {
            this.boardConfig.board.arrayBlocks[currentRow].forEach(function (block) {
                if (block !== 0 && block.isLocked()) {
                    block.lockToDestroy();
                    self.removeLocks.push(block);
                }
            })
        }
        this.onChange(currentRow, (changed)=>{
            if(changed){
                this.clearRemoveQueue();
            }
        });
    }
    clearRemoveQueue(){
        for(let bIndex in this.removeLocks){
            if(this.removeLocks.hasOwnProperty(bIndex)) {
                let block = this.removeLocks[bIndex];
                this.boardConfig.board.remove(block);
                block._sprite.destroy();
            }
        }
        this.removeLocks = [];
    }

    onChange(posX, callback){
        if(posX !== this.lastIndex){
            this.lastIndex = posX;
            this.lastQueue = this.removeLocks.length;
            callback(this.lastQueue == this.removeLocks.length);
        }

    }

    setPosition(x){
        this._sprite.x = x;
    }


}/**
 * Created by mmitis on 22.01.16.
 */
