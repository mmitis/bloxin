/**
 * Created by mmitis on 23.01.16.
 */
export default class Board {

    constructor(width, height){
        this.width = width;
        this.height = height;
        this.arrayBlocks = [];
        this.arrayFills = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.arrayList = [];
        for(var i = 0; i < width; i++) {
            this.arrayBlocks[i] = [];
            this.arrayFills[i] = 0;
            for (var j = 0; j < height; j++) {
                this.arrayBlocks[i][j] = 0;
            }
        }

    }
    setGround(x,y, block){
        this.arrayBlocks[x][y] = block;
        this.arrayList.push(block);
        this.arrayFills[x]++;
        this.scanBoard(x,y, block);
    }

    scanBoard(x,y){
        var self = this;
        setTimeout(()=>{
            for(let block in this.arrayList){
                if(this.arrayList.hasOwnProperty(block)){
                    let prim = this.arrayList[block];
                    if( (typeof self.arrayBlocks[prim.posX+1][prim.posY] !== 'undefined' && self.arrayBlocks[prim.posX+1][prim.posY].getType && self.arrayBlocks[prim.posX+1][prim.posY].getType().color === prim.getType().color) &&
                        (typeof self.arrayBlocks[prim.posX+1][prim.posY+1] !== 'undefined' && self.arrayBlocks[prim.posX+1][prim.posY+1].getType && self.arrayBlocks[prim.posX+1][prim.posY+1].getType().color === prim.getType().color) &&
                        (typeof self.arrayBlocks[prim.posX][prim.posY+1] !== 'undefined' && self.arrayBlocks[prim.posX][prim.posY+1].getType && self.arrayBlocks[prim.posX][prim.posY+1].getType().color === prim.getType().color)
                    ){
                        prim.lockToRemove();
                        self.arrayBlocks[prim.posX+1][prim.posY].lockToRemove();
                        self.arrayBlocks[prim.posX+1][prim.posY+1].lockToRemove();
                        self.arrayBlocks[prim.posX][prim.posY+1].lockToRemove();
                    }
                }
            }

        },5);

    }

    unattach(block){
        this.arrayList.splice(this.arrayList.indexOf(block), 1);
        this.arrayBlocks[block.posX][block.posY] = 0;
        this.arrayFills[block.posX]--;

    }

    remove(block){
        this.unattach(block);
        //Update all above
        for(let y = block.posY; y < 10; y++){
            if(this.arrayBlocks[block.posX][y] && this.arrayBlocks[block.posX][y] !== 0 && !this.arrayBlocks[block.posX][y].isDestroyed()){
                this.arrayBlocks[block.posX][y].rollAgain();
                this.unattach(this.arrayBlocks[block.posX][y]);
            }
        }
    }

}