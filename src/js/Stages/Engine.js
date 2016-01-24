import Block from '../Structures/Block';
import BlockGroup from '../Structures/BlockGroup';
import BottomLine from '../Structures/BottomLine';
import ProgressLine from '../Structures/ProgressLine';
import Board from '../Structures/Board';


var sizeX = 660;
var sizeY = 440;


var config = {
    offsetInner : 10,
    offsetOuter : 30,
    width: 16,
    height: 10,
    margin: 1,
    barSpeed: 90,
    blockSpeed : 70,
    pullDownSpeed: 500,
    throwDurationDelay: 1500
};


var boardConfig = {
        startX      : () =>config.offsetOuter,
        startY      : () =>config.offsetOuter,
        endX        : () => sizeX - config.offsetOuter,
        endY        : () => sizeY - config.offsetOuter,
        width       : function(){ return this.endX() - this.startX()},
        height      : function(){ return this.endY() - this.startY()},
        insideStartX: function(){ return this.startX() + config.offsetInner},
        insideStartY: function(){ return this.startY() + config.offsetInner},
        insideEndX  : function(){ return this.endX() - 2*config.offsetInner},
        insideEndY  : function(){ return this.endY() - 2*config.offsetInner},
        insideWidth : function(){ return this.insideEndX() - this.insideStartX()},
        insideHeight: function(){ return this.insideEndY() - this.insideStartY()},
        boxSize     : function(){ return Math.floor(this.insideWidth() / config.width - config.margin)},
        boardSize   : function(){ return config.width; },
        boxMargin   : ()=>config.margin,
        boxSizeM    :function(){ return this.boxSize() + this.boxMargin() },
        boxPosX     : function(x){ return this.insideStartX() + x*this.boxSizeM() },
        boxPosY     : function(y){ return this.insideStartY() +y*this.boxSizeM() },
        barSpeed    : function(){return config.barSpeed},
        blockSpeed  : function(){return config.blockSpeed},
        pullDownSpeed:function(){return config.pullDownSpeed},
        throwDelayDuration: function(){return config.throwDurationDelay},
        boardFills  : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        board : new Board(config.width, config.height),
        blockTypes : [
            { name : 'Normal', color : 0xE67E22 },
            { name : 'Normal', color : 0x2ECC71 }
        ]
};

export default class Engine {

    create(){
        this.game.renderer.renderSession.roundPixels = true;
        this.game.stage.backgroundColor = '#161a1e';
        //Draw board
        this._board = this.drawBoard(boardConfig);
        this.game.input.addPointer();
        this._bottomLine = new BottomLine(this.game, boardConfig);
        this._line  = new ProgressLine(this.game, boardConfig);
        this._line.setPosition(40);
        this.generateBlock();
        this.pickControls();
        this.touchLock = false;
    }

    update(){
        this._line.updateCoords();
        if(!this._activeBlockGroup.updateGroup()){
            this.generateBlock();
        }
        this.pickTouchControls()


    }

    drawBoard(mapConfig){
        var boardBorders = this.game.add.graphics( 0, 0 );
        boardBorders.beginFill(0x34495e, 1);
        boardBorders.bounds = new PIXI.Rectangle(0, 0,  mapConfig.width(), mapConfig.height());
        boardBorders.drawRect(mapConfig.startX(), mapConfig.startY(), mapConfig.width(), mapConfig.height());
        boardBorders.boundsPadding = 0;
        return boardBorders;
    }

    generateBlock(){
        this.lastBlocks = this._activeBlockGroup;
        this._activeBlockGroup = new BlockGroup(this.game, this._bottomLine, boardConfig, { x: 7, y : 0});
    }

    pickControls(){
        const controls = {
            left :  this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            right : this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            down : this.game.input.keyboard.addKey(Phaser.Keyboard.C),
            rotateLeft : this.game.input.keyboard.addKey(Phaser.Keyboard.Z),
            rotateRight : this.game.input.keyboard.addKey(Phaser.Keyboard.X)
        };

        const handleControl = ()=>{
            if (controls.left.isDown) {
                this._activeBlockGroup.moveLeft();
            }
            if (controls.right.isDown) {
                this._activeBlockGroup.moveRight();
            }
            if (controls.rotateLeft.isDown) {
                this._activeBlockGroup.rotateLeft();
            }
            if (controls.rotateRight.isDown) {
                this._activeBlockGroup.rotateRight();
            }
            if (controls.down.isDown) {
                this._activeBlockGroup.pullDown();
            }

        };
        controls.left.onDown.add(handleControl, this);
        controls.right.onDown.add(handleControl, this);
        controls.down.onDown.add(handleControl, this);
        controls.rotateLeft.onDown.add(handleControl, this);
        controls.rotateRight.onDown.add(handleControl, this);
    }

    pickTouchControls() {


        if(this.swipeHandling(150, this.game) == 0 && this.touchLock == false){
            this.touchLock = true;
            setTimeout(()=>{
                this.touchLock = false;
            }, 100);
            this._activeBlockGroup.rotateLeft();
        }
        else if (this.game.input.activePointer.isDown && this.game.input.activePointer.worldX < 330 && this.touchLock == false) {
            this.touchLock = true;
            setTimeout(()=>{
                this.touchLock = false;
            }, 100);
            this._activeBlockGroup.moveLeft();
        }
        else if (this.game.input.activePointer.isDown && this.game.input.activePointer.worldX > 330 && this.touchLock == false) {
            this.touchLock = true;
            setTimeout(()=>{
                this.touchLock = false;
            }, 100);
            this._activeBlockGroup.moveRight();
        }
;

    }

    swipeHandling(distance, game) {
        let firstPointX, lastPointX, firstPointY, lastPointY;
        if (Phaser.Point.distance(game.input.activePointer.position, game.input.activePointer.positionDown) > distance && game.input.activePointer.duration > 100 && game.input.activePointer.duration < 250)
        {
            firstPointX = game.input.activePointer.positionDown.x;
            firstPointY = game.input.activePointer.positionDown.y;

            lastPointX = game.input.activePointer.position.x;
            lastPointY = game.input.activePointer.position.y;

                if(firstPointX > lastPointX){
                    if ( firstPointX - lastPointX >= distance ) {
                        return 3;
                    }
                } else if(firstPointX < lastPointX){
                    if ( lastPointX - firstPointX >= distance ) {
                        return 1;
                    }
                }
                if(firstPointY > lastPointY){
                    if ( firstPointY - lastPointY >= distance ) {
                        return 0;
                    }

                } else if(firstPointY < lastPointY) {
                    if (lastPointY - firstPointY >= distance) {
                        return 2;
                    }
                }
        }
        return null;
    }
}
