var Star = function(game, name) {
    Phaser.Sprite.call(this, game, game.world.width / 2, game.world.height / 2, name);

    this.anchor.setTo(0.5, 0.5);
};

Star.prototype = Object.create(Phaser.Sprite.prototype);
Star.prototype.constructor = Star;

Star.prototype.update = function() {
    this.rotation += 0.001;
};