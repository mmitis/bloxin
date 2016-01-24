export default class BottomLine {
    constructor(game, config){

        let tmpLine = game.add.graphics(0, 0);
        tmpLine.lineStyle(10, 0x7f8c8d, 1);
        tmpLine.moveTo(0, 0);
        tmpLine.lineTo(config.insideWidth(), 0);
        tmpLine.boundsPadding = 0;
        this._direction = true;
        this._sprite = game.add.sprite(config.insideStartX(), config.insideEndY(), tmpLine.generateTexture());
        tmpLine.destroy();
        game.physics.arcade.enable(this._sprite);
    }

}
