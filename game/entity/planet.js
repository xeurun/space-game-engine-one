var Planet = function(game, name, scale, distance, speed) {
    Phaser.Sprite.call(this, game, game.world.width / 2, game.world.height / 2, name);

    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(scale, scale);
    this.pivot.x = distance;
    this.rotationSpeed = speed;
};

Planet.prototype = Object.create(Phaser.Sprite.prototype);
Planet.prototype.constructor = Planet;

Planet.prototype.update = function() {
    this.rotation += this.rotationSpeed;
};