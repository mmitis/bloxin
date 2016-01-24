function Boot (game){};

Boot.prototype = {
	create: function(){
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