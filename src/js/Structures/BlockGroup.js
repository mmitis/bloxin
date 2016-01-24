import Block from './Block';

export default class BlockGroup {

    constructor(game, bottomLine, boardConfig, pos){
        this.rollActive = false;
        this.blocksHold = [];
        this.boardConfig = boardConfig;
        this.blocksHold.push( new Block(game, bottomLine, boardConfig, pos.x+1, pos.y + 1, this.randType()));
        this.blocksHold.push( new Block(game, bottomLine, boardConfig, pos.x, pos.y+1, this.randType()));
        this.blocksHold.push( new Block(game, bottomLine, boardConfig, pos.x, pos.y, this.randType()));
        this.blocksHold.push( new Block(game, bottomLine, boardConfig, pos.x+1, pos.y, this.randType()));
    }

    randType(){
        return this.boardConfig.blockTypes[Math.floor(this.boardConfig.blockTypes.length * Math.random())]
    }

    updateGroup(){
        let rollCounter = 0;
        this.blocksHold.forEach(function(block) {
            if (block.isRolling() == true){
                block.updateCoords();
            } else {
                rollCounter++;
            }
        }, this);
        this.rollActive = !(this.blocksHold.length == rollCounter);
        return this.rollActive;

    }
    moveRight(){
        let canMove = true;
        if(this.rollActive) {
            this.blocksHold.forEach(function (item) {
                if(!item.canMoveRight()){
                    canMove = false;
                }
            });
            if(canMove == true){
                this.blocksHold.forEach(function (item) {
                   item.moveRight();
                });
            }
        }
    }

    pullDown(){
        this.blocksHold.forEach(function (item) {
            item.pullDown();
        });
    }

    rotateLeft(){
        if(this.rollActive) {
            let tmp = {
                x: this.blocksHold[0]._sprite.x,
                y: this.blocksHold[0]._sprite.y
            };
            this.blocksHold[0].setBigCoords(this.blocksHold[1]._sprite.x, this.blocksHold[1]._sprite.y);
            this.blocksHold[1].setBigCoords(this.blocksHold[2]._sprite.x, this.blocksHold[2]._sprite.y);
            this.blocksHold[2].setBigCoords(this.blocksHold[3]._sprite.x, this.blocksHold[3]._sprite.y);
            this.blocksHold[3].setBigCoords(tmp.x, tmp.y);
        }
    }

    rotateRight(){
        if(this.rollActive) {
            let tmp = {
                x: this.blocksHold[2]._sprite.x,
                y: this.blocksHold[2]._sprite.y
            };
            this.blocksHold[2].setBigCoords(this.blocksHold[1]._sprite.x, this.blocksHold[1]._sprite.y);
            this.blocksHold[1].setBigCoords(this.blocksHold[0]._sprite.x, this.blocksHold[0]._sprite.y);
            this.blocksHold[0].setBigCoords(this.blocksHold[3]._sprite.x, this.blocksHold[3]._sprite.y);
            this.blocksHold[3].setBigCoords(tmp.x, tmp.y);
        }

    }
    moveLeft(){
        let canMove = true;
        if(this.rollActive) {
            this.blocksHold.forEach(function (item) {
                if(!item.canMoveLeft()){
                    canMove = false;
                }
            });
            if(canMove == true){

                this.blocksHold.forEach(function (item) {
                    item.moveLeft();
                });
            }
        }
    }
}