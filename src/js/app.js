/**
 * Created by mmitis on 22.01.16.
 */
import Boot from './Stages/Boot';
import Engine from './Stages/Engine';

const game = new Phaser.Game(660, 440, Phaser.CANVAS, 'game');
game.state.add('Boot', Boot);
game.state.add('Engine', Engine);
game.state.start('Boot');
