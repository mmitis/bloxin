(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function Boot(game) {};

Boot.prototype = {
	create: function create() {
		// set scale options
		// this.input.maxPointers = 1;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		// start the Preloader state
		this.game.state.start('Engine');
		this.game.scale.startFullScreen(false);
	}
};
module.exports = Boot;

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Block = require('../Structures/Block');

var _Block2 = _interopRequireDefault(_Block);

var _BlockGroup = require('../Structures/BlockGroup');

var _BlockGroup2 = _interopRequireDefault(_BlockGroup);

var _BottomLine = require('../Structures/BottomLine');

var _BottomLine2 = _interopRequireDefault(_BottomLine);

var _ProgressLine = require('../Structures/ProgressLine');

var _ProgressLine2 = _interopRequireDefault(_ProgressLine);

var _Board = require('../Structures/Board');

var _Board2 = _interopRequireDefault(_Board);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sizeX = 660;
var sizeY = 440;

var config = {
    offsetInner: 10,
    offsetOuter: 30,
    width: 16,
    height: 10,
    margin: 1,
    barSpeed: 90,
    blockSpeed: 70,
    pullDownSpeed: 500,
    throwDurationDelay: 1500
};

var board = new _Board2.default(config.width, config.height);
var boardConfig = {
    startX: function startX() {
        return config.offsetOuter;
    },
    startY: function startY() {
        return config.offsetOuter;
    },
    endX: function endX() {
        return sizeX - config.offsetOuter;
    },
    endY: function endY() {
        return sizeY - config.offsetOuter;
    },
    width: function width() {
        return this.endX() - this.startX();
    },
    height: function height() {
        return this.endY() - this.startY();
    },
    insideStartX: function insideStartX() {
        return this.startX() + config.offsetInner;
    },
    insideStartY: function insideStartY() {
        return this.startY() + config.offsetInner;
    },
    insideEndX: function insideEndX() {
        return this.endX() - 2 * config.offsetInner;
    },
    insideEndY: function insideEndY() {
        return this.endY() - 2 * config.offsetInner;
    },
    insideWidth: function insideWidth() {
        return this.insideEndX() - this.insideStartX();
    },
    insideHeight: function insideHeight() {
        return this.insideEndY() - this.insideStartY();
    },
    boxSize: function boxSize() {
        return Math.floor(this.insideWidth() / config.width - config.margin);
    },
    boardSize: function boardSize() {
        return config.width;
    },
    boxMargin: function boxMargin() {
        return config.margin;
    },
    boxSizeM: function boxSizeM() {
        return this.boxSize() + this.boxMargin();
    },
    boxPosX: function boxPosX(x) {
        return this.insideStartX() + x * this.boxSizeM();
    },
    boxPosY: function boxPosY(y) {
        return this.insideStartY() + y * this.boxSizeM();
    },
    barSpeed: function barSpeed() {
        return config.barSpeed;
    },
    blockSpeed: function blockSpeed() {
        return config.blockSpeed;
    },
    pullDownSpeed: function pullDownSpeed() {
        return config.pullDownSpeed;
    },
    throwDelayDuration: function throwDelayDuration() {
        return config.throwDurationDelay;
    },
    boardFills: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    board: board,
    blockTypes: [{ name: 'Normal', color: 0xE67E22 }, { name: 'Normal', color: 0x2ECC71 }]
};

var Engine = function () {
    function Engine() {
        _classCallCheck(this, Engine);
    }

    _createClass(Engine, [{
        key: 'create',
        value: function create() {
            this.game.renderer.renderSession.roundPixels = true;
            this.game.stage.backgroundColor = '#161a1e';
            //Draw board
            this._board = this.drawBoard(boardConfig);
            this.game.input.addPointer();
            this._bottomLine = new _BottomLine2.default(this.game, boardConfig);
            this._line = new _ProgressLine2.default(this.game, boardConfig);
            this._line.setPosition(40);
            this.generateBlock();
            this.pickControls();
            this.touchLock = false;
            this._freeBlocks = [];
        }
    }, {
        key: 'update',
        value: function update() {
            var _this = this;

            this._line.updateCoords();
            if (!this._activeBlockGroup.updateGroup()) {
                this._activeBlockGroup.blocksHold.forEach(function (block) {
                    _this._freeBlocks.push(block);
                });
                this.generateBlock();
            }
            this._freeBlocks.forEach(function (block) {
                if (block.isRolling()) {
                    block.updateCoords();
                }
            });
            this.pickTouchControls();
        }
    }, {
        key: 'drawBoard',
        value: function drawBoard(mapConfig) {
            var boardBorders = this.game.add.graphics(0, 0);
            boardBorders.beginFill(0x34495e, 1);
            boardBorders.bounds = new PIXI.Rectangle(0, 0, mapConfig.width(), mapConfig.height());
            boardBorders.drawRect(mapConfig.startX(), mapConfig.startY(), mapConfig.width(), mapConfig.height());
            boardBorders.boundsPadding = 0;
            return boardBorders;
        }
    }, {
        key: 'generateBlock',
        value: function generateBlock() {
            this.lastBlocks = this._activeBlockGroup;
            this._activeBlockGroup = new _BlockGroup2.default(this.game, this._bottomLine, boardConfig, { x: 7, y: 0 });
        }
    }, {
        key: 'pickControls',
        value: function pickControls() {
            var _this2 = this;

            var controls = {
                left: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
                right: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
                down: this.game.input.keyboard.addKey(Phaser.Keyboard.C),
                rotateLeft: this.game.input.keyboard.addKey(Phaser.Keyboard.Z),
                rotateRight: this.game.input.keyboard.addKey(Phaser.Keyboard.X)
            };

            var handleControl = function handleControl() {
                if (controls.left.isDown) {
                    _this2._activeBlockGroup.moveLeft();
                }
                if (controls.right.isDown) {
                    _this2._activeBlockGroup.moveRight();
                }
                if (controls.rotateLeft.isDown) {
                    _this2._activeBlockGroup.rotateLeft();
                }
                if (controls.rotateRight.isDown) {
                    _this2._activeBlockGroup.rotateRight();
                }
                if (controls.down.isDown) {
                    _this2._activeBlockGroup.pullDown();
                }
            };
            controls.left.onDown.add(handleControl, this);
            controls.right.onDown.add(handleControl, this);
            controls.down.onDown.add(handleControl, this);
            controls.rotateLeft.onDown.add(handleControl, this);
            controls.rotateRight.onDown.add(handleControl, this);
        }
    }, {
        key: 'pickTouchControls',
        value: function pickTouchControls() {
            var _this3 = this;

            if (this.game.input.activePointer.isDown && this.game.input.activePointer.worldY < 250 && this.game.input.activePointer.worldX < 330 && this.touchLock == false) {
                this.touchLock = true;
                setTimeout(function () {
                    _this3.touchLock = false;
                }, 100);
                this._activeBlockGroup.moveLeft();
            } else if (this.game.input.activePointer.isDown && this.game.input.activePointer.worldY < 250 && this.game.input.activePointer.worldX > 330 && this.touchLock == false) {
                this.touchLock = true;
                setTimeout(function () {
                    _this3.touchLock = false;
                }, 100);
                this._activeBlockGroup.moveRight();
            } else if (this.game.input.activePointer.isDown && this.game.input.activePointer.worldY > 250 && this.touchLock == false) {
                this.touchLock = true;
                setTimeout(function () {
                    _this3.touchLock = false;
                }, 100);
                this._activeBlockGroup.pullDown();
            }
        }
    }]);

    return Engine;
}();

exports.default = Engine;

},{"../Structures/Block":3,"../Structures/BlockGroup":4,"../Structures/Board":5,"../Structures/BottomLine":6,"../Structures/ProgressLine":7}],3:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Block = function () {
    /**
     * Constructor of the Basic Block Object
     * @param game - Phaser Game Object
     * @param bottomLine - Handler to the bottom line
     * @param boardConfig - Configuration of the object
     * @param posX - starting position X (in size of board)
     * @param posY - starting position Y (in size of board)
     * @param blockType - object with the block setup details
     */

    function Block(game, bottomLine, boardConfig, posX, posY, blockType) {
        _classCallCheck(this, Block);

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
        this.boxSized = Math.floor(this.boardConfig.boxSizeM());
    }

    /**
     * Moves Block right if it is possible
     * @returns {boolean} true is moved, false if cannot move
     */

    _createClass(Block, [{
        key: "moveRight",
        value: function moveRight() {
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

    }, {
        key: "moveLeft",
        value: function moveLeft() {
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

    }, {
        key: "canMoveRight",
        value: function canMoveRight() {
            return !this.blockConfig.rollingLock && this.posX + 1 < this.boardConfig.boardSize() - 1 && this.fillBottom - this.boardConfig.board.arrayFills[this.posX + 1] * this.boxSized > Math.floor(this._sprite.y);
        }

        /**
         * Check if object can be moved into left
         * @returns {boolean} true if can, false if cannot
         */

    }, {
        key: "canMoveLeft",
        value: function canMoveLeft() {
            return !this.blockConfig.rollingLock && this.posX - 1 >= 0 && this.fillBottom - this.boardConfig.board.arrayFills[this.posX - 1] * this.boxSized > Math.floor(this._sprite.y);
        }
    }, {
        key: "pullDown",
        value: function pullDown() {
            if (this.blockConfig.pulledDownLock == false) {
                this.blockConfig.pulledDownLock = true;
            }
        }
    }, {
        key: "getType",
        value: function getType() {
            return this.type;
        }
    }, {
        key: "isRolling",
        value: function isRolling() {
            return this.blockConfig.rolling;
        }
    }, {
        key: "setPosition",
        value: function setPosition(x, y) {
            this._sprite.x = x;
            this._sprite.y = y;
        }
    }, {
        key: "thowDelay",
        value: function thowDelay() {
            var _this = this;

            setTimeout(function () {
                _this.blockConfig.delayLock = false;
            }, this.boardConfig.throwDelayDuration());
        }
    }, {
        key: "updateCoords",
        value: function updateCoords() {
            if (this.blockConfig.rolling == true && (!this.blockConfig.delayLock || this.blockConfig.pulledDownLock)) {
                if (this.blockConfig.pulledDownLock) {
                    this._sprite.body.velocity.y = this.boardConfig.pullDownSpeed();
                } else {
                    this._sprite.body.velocity.y = this.boardConfig.blockSpeed();
                }
                this.checkHitGround();
            } else if (this.blockConfig.rolling == false) {
                this._sprite.y = Math.floor(this.fillBottom - this.boardConfig.board.arrayFills[this.posX] * this.boxSized - 1);
            }
        }
    }, {
        key: "checkHitGround",
        value: function checkHitGround() {
            var calculatedPos = Math.ceil((this.fillBottom - Math.floor(this._sprite.y)) / this.boxSized); // Math.floor(this.fillBottom - (this.boardConfig.boardFills[this.posX]) * this.boxSized);
            if (Math.floor(this._sprite.y) >= Math.floor(this.fillBottom - this.boardConfig.board.arrayFills[this.posX] * this.boxSized)) {
                this._sprite.body.velocity.y = 0;
                this.blockConfig.rolling = false;
                this._sprite.y = Math.floor(this.fillBottom - this.boardConfig.board.arrayFills[this.posX] * this.boxSized - 1);
                this.blockConfig.rollingLock = true;
                this._sprite.body.moves = false;
                this.posY = calculatedPos;
                this.boardConfig.board.setGround(this.posX, calculatedPos, this);
            }
        }
    }, {
        key: "setBigCoords",
        value: function setBigCoords(x, y) {
            this._sprite.y = y;
            this._sprite.x = x;
            this.posY = Math.floor((this._bottomLine._sprite.y + this.boardConfig.startY() - this._sprite.y) / this.boardConfig.boxSizeM());
            this.posX = Math.floor((this._sprite.x - this.boardConfig.insideStartX()) / this.boardConfig.boxSizeM());
        }
    }, {
        key: "lockToRemove",
        value: function lockToRemove() {
            this._sprite.alpha = 0.7;
            this.status = 1;
        }
    }, {
        key: "lockToDestroy",
        value: function lockToDestroy() {
            this._sprite.alpha = 0.2;
            this.status = 2;
        }
    }, {
        key: "isLocked",
        value: function isLocked() {
            return this.status == 1;
        }
    }, {
        key: "isDestroyed",
        value: function isDestroyed() {
            return this.status == 2;
        }
    }, {
        key: "rollAgain",
        value: function rollAgain() {
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
    }]);

    return Block;
}();

exports.default = Block;

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Block = require('./Block');

var _Block2 = _interopRequireDefault(_Block);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BlockGroup = function () {
    function BlockGroup(game, bottomLine, boardConfig, pos) {
        _classCallCheck(this, BlockGroup);

        this.rollActive = false;
        this.blocksHold = [];
        this.boardConfig = boardConfig;
        this.blocksHold.push(new _Block2.default(game, bottomLine, boardConfig, pos.x + 1, pos.y + 1, this.randType()));
        this.blocksHold.push(new _Block2.default(game, bottomLine, boardConfig, pos.x, pos.y + 1, this.randType()));
        this.blocksHold.push(new _Block2.default(game, bottomLine, boardConfig, pos.x, pos.y, this.randType()));
        this.blocksHold.push(new _Block2.default(game, bottomLine, boardConfig, pos.x + 1, pos.y, this.randType()));
    }

    _createClass(BlockGroup, [{
        key: 'randType',
        value: function randType() {
            return this.boardConfig.blockTypes[Math.floor(this.boardConfig.blockTypes.length * Math.random())];
        }
    }, {
        key: 'updateGroup',
        value: function updateGroup() {
            var rollCounter = 0;
            this.blocksHold.forEach(function (block) {
                if (block.isRolling() == true) {
                    block.updateCoords();
                } else {
                    rollCounter++;
                }
            }, this);
            this.rollActive = !(this.blocksHold.length == rollCounter);
            return this.rollActive;
        }
    }, {
        key: 'moveRight',
        value: function moveRight() {
            var canMove = true;
            if (this.rollActive) {
                this.blocksHold.forEach(function (item) {
                    if (!item.canMoveRight()) {
                        canMove = false;
                    }
                });
                if (canMove == true) {
                    this.blocksHold.forEach(function (item) {
                        item.moveRight();
                    });
                }
            }
        }
    }, {
        key: 'pullDown',
        value: function pullDown() {
            this.blocksHold.forEach(function (item) {
                item.pullDown();
            });
        }
    }, {
        key: 'rotateLeft',
        value: function rotateLeft() {
            if (this.rollActive) {
                var tmp = {
                    x: this.blocksHold[0]._sprite.x,
                    y: this.blocksHold[0]._sprite.y
                };
                this.blocksHold[0].setBigCoords(this.blocksHold[1]._sprite.x, this.blocksHold[1]._sprite.y);
                this.blocksHold[1].setBigCoords(this.blocksHold[2]._sprite.x, this.blocksHold[2]._sprite.y);
                this.blocksHold[2].setBigCoords(this.blocksHold[3]._sprite.x, this.blocksHold[3]._sprite.y);
                this.blocksHold[3].setBigCoords(tmp.x, tmp.y);
            }
        }
    }, {
        key: 'rotateRight',
        value: function rotateRight() {
            if (this.rollActive) {
                var tmp = {
                    x: this.blocksHold[2]._sprite.x,
                    y: this.blocksHold[2]._sprite.y
                };
                this.blocksHold[2].setBigCoords(this.blocksHold[1]._sprite.x, this.blocksHold[1]._sprite.y);
                this.blocksHold[1].setBigCoords(this.blocksHold[0]._sprite.x, this.blocksHold[0]._sprite.y);
                this.blocksHold[0].setBigCoords(this.blocksHold[3]._sprite.x, this.blocksHold[3]._sprite.y);
                this.blocksHold[3].setBigCoords(tmp.x, tmp.y);
            }
        }
    }, {
        key: 'moveLeft',
        value: function moveLeft() {
            var canMove = true;
            if (this.rollActive) {
                this.blocksHold.forEach(function (item) {
                    if (!item.canMoveLeft()) {
                        canMove = false;
                    }
                });
                if (canMove == true) {

                    this.blocksHold.forEach(function (item) {
                        item.moveLeft();
                    });
                }
            }
        }
    }]);

    return BlockGroup;
}();

exports.default = BlockGroup;

},{"./Block":3}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by mmitis on 23.01.16.
 */

var Board = function () {
    function Board(width, height) {
        _classCallCheck(this, Board);

        this.width = width;
        this.height = height;
        this.arrayBlocks = [];
        this.arrayFills = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.arrayList = [];
        for (var i = 0; i < width; i++) {
            this.arrayBlocks[i] = [];
            this.arrayFills[i] = 0;
            for (var j = 0; j < height; j++) {
                this.arrayBlocks[i][j] = 0;
            }
        }
    }

    _createClass(Board, [{
        key: 'setGround',
        value: function setGround(x, y, block) {
            this.arrayBlocks[x][y] = block;
            this.arrayList.push(block);
            this.arrayFills[x]++;
            this.scanBoard(x, y, block);
        }
    }, {
        key: 'scanBoard',
        value: function scanBoard(x, y) {
            var _this = this;

            var self = this;
            setTimeout(function () {
                for (var block in _this.arrayList) {
                    if (_this.arrayList.hasOwnProperty(block)) {
                        var prim = _this.arrayList[block];
                        if (typeof self.arrayBlocks[prim.posX + 1][prim.posY] !== 'undefined' && self.arrayBlocks[prim.posX + 1][prim.posY].getType && self.arrayBlocks[prim.posX + 1][prim.posY].getType().color === prim.getType().color && typeof self.arrayBlocks[prim.posX + 1][prim.posY + 1] !== 'undefined' && self.arrayBlocks[prim.posX + 1][prim.posY + 1].getType && self.arrayBlocks[prim.posX + 1][prim.posY + 1].getType().color === prim.getType().color && typeof self.arrayBlocks[prim.posX][prim.posY + 1] !== 'undefined' && self.arrayBlocks[prim.posX][prim.posY + 1].getType && self.arrayBlocks[prim.posX][prim.posY + 1].getType().color === prim.getType().color) {
                            prim.lockToRemove();
                            self.arrayBlocks[prim.posX + 1][prim.posY].lockToRemove();
                            self.arrayBlocks[prim.posX + 1][prim.posY + 1].lockToRemove();
                            self.arrayBlocks[prim.posX][prim.posY + 1].lockToRemove();
                        }
                    }
                }
            }, 5);
        }
    }, {
        key: 'unattach',
        value: function unattach(block) {
            this.arrayList.splice(this.arrayList.indexOf(block), 1);
            this.arrayBlocks[block.posX][block.posY] = 0;
            this.arrayFills[block.posX]--;
        }
    }, {
        key: 'remove',
        value: function remove(block) {
            this.unattach(block);
            //Update all above
            for (var y = block.posY; y < 10; y++) {
                if (this.arrayBlocks[block.posX][y] && this.arrayBlocks[block.posX][y] !== 0 && !this.arrayBlocks[block.posX][y].isDestroyed()) {
                    this.arrayBlocks[block.posX][y].rollAgain();
                    this.unattach(this.arrayBlocks[block.posX][y]);
                }
            }
        }
    }]);

    return Board;
}();

exports.default = Board;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BottomLine = function BottomLine(game, config) {
    _classCallCheck(this, BottomLine);

    var tmpLine = game.add.graphics(0, 0);
    tmpLine.lineStyle(10, 0x7f8c8d, 1);
    tmpLine.moveTo(0, 0);
    tmpLine.lineTo(config.insideWidth(), 0);
    tmpLine.boundsPadding = 0;
    this._direction = true;
    this._sprite = game.add.sprite(config.insideStartX(), config.insideEndY(), tmpLine.generateTexture());
    tmpLine.destroy();
    game.physics.arcade.enable(this._sprite);
};

exports.default = BottomLine;

},{}],7:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProgressLine = function () {
    function ProgressLine(game, boardConfig) {
        _classCallCheck(this, ProgressLine);

        this.boardConfig = boardConfig;
        var tmpLine = game.add.graphics(0, 0);
        tmpLine.lineStyle(10, 0xc0392b, 1);
        tmpLine.moveTo(0, 0);
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

    _createClass(ProgressLine, [{
        key: "roundPosition",
        value: function roundPosition(value) {
            if (!this._direction) {
                return Math.floor(value);
            }
            return Math.round(value);
        }
    }, {
        key: "updateCoords",
        value: function updateCoords() {
            var _this = this;

            var self = this;
            var currentRow = this.roundPosition((this._sprite.x - this.boardConfig.insideStartX()) / this.boardConfig.boxSizeM());
            this._sprite.bringToTop();
            if (this._sprite.x > this.boardConfig.insideEndX() && this._direction == true) {
                this._direction = false;
                this.clearRemoveQueue();
                this._sprite.body.velocity.x = -1 * this.boardConfig.barSpeed();
            } else if (this._sprite.x < this.boardConfig.insideStartX()) {
                this._direction = true;
                this.clearRemoveQueue();
                this._sprite.body.velocity.x = this.boardConfig.barSpeed();
            }

            this.onChange(currentRow, function (row) {

                if (_this.lastQueue !== 0 && _this.lastQueue === self.removeLocks.length) {
                    _this.clearRemoveQueue();
                }
                _this.lastQueue = self.removeLocks.length;
            });

            if (this.boardConfig.board.arrayBlocks[currentRow]) {
                this.boardConfig.board.arrayBlocks[currentRow].forEach(function (block) {
                    if (block !== 0 && block.isLocked()) {
                        block.lockToDestroy();
                        self.removeLocks.push(block);
                    }
                });
            }
        }
    }, {
        key: "clearRemoveQueue",
        value: function clearRemoveQueue() {
            for (var bIndex in this.removeLocks) {
                if (this.removeLocks.hasOwnProperty(bIndex)) {
                    var block = this.removeLocks[bIndex];
                    this.boardConfig.board.remove(block);
                    block._sprite.destroy();
                }
            }
            this.removeLocks = [];
        }
    }, {
        key: "onChange",
        value: function onChange(posX, callback) {
            if (posX !== this.lastIndex) {
                this.lastIndex = posX;
                callback(posX);
            }
        }
    }, {
        key: "setPosition",
        value: function setPosition(x) {
            this._sprite.x = x;
        }
    }]);

    return ProgressLine;
}(); /**
     * Created by mmitis on 22.01.16.
     */

exports.default = ProgressLine;

},{}],8:[function(require,module,exports){
'use strict';

var _Boot = require('./Stages/Boot');

var _Boot2 = _interopRequireDefault(_Boot);

var _Engine = require('./Stages/Engine');

var _Engine2 = _interopRequireDefault(_Engine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mmitis on 22.01.16.
 */

var game = new Phaser.Game(660, 440, Phaser.CANVAS, 'game');
game.state.add('Boot', _Boot2.default);
game.state.add('Engine', _Engine2.default);
game.state.start('Boot');

},{"./Stages/Boot":1,"./Stages/Engine":2}]},{},[8]);
