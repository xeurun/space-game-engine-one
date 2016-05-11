var Ship = function(game, skin, id, currentPosition, nextPosition) {
    Phaser.Sprite.call(this, game, game.world.width / 2, game.world.height / 2, skin);
    
    this.scale.setTo(0.2, 0.2);
    this.anchor.setTo(0.5, 0.5);

    this.SPEED = 200;
    this.TURN_RATE = 5;
    this.health = 10000;

    this.line = new Phaser.Line(0, 0, 0, 0);

    this.id = id;
    this.x = currentPosition.x;
    this.y = currentPosition.y;
    this.nextPosition = nextPosition;

    this.animations.add('run');
    this.animations.play('run', 49, true);
    this.animations.currentAnim.speed = 15;
    
    this.inputEnabled = true;
    this.input.priorityID = 2;
    this.input.useHandCursor = true;
    this.events.onInputDown.add(function(sprite, pointer) {
        pointer.currentTarget = sprite;
        game.trigger('follow', null, this);
    }, this);
    this.events.onInputOver.add(function(sprite, pointer) {
        var element = document.getElementById('shipInfo');
        element.textContent = sprite.health;
        element.style.top = sprite.worldPosition.y + (sprite.height / 2) + 'px';
        element.style.left = sprite.worldPosition.x + (sprite.width / 2) + 'px';
        element.style.display = 'block';
    }, this);
    this.events.onInputOut.add(function(sprite, pointer) {
        var element = document.getElementById('shipInfo');
        element.style.display = 'none';
    }, this);
};

Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.update = function() {
    if (this.nextPosition.x != null && this.nextPosition.y != null) {
        var targetAngle = this.game.math.angleBetween(
            this.x, this.y,
            this.nextPosition.x, this.nextPosition.y
        );

        if (this.rotation !== targetAngle) {
            var delta = targetAngle - this.rotation;

            if (delta > Math.PI) delta -= Math.PI * 2;
            if (delta < -Math.PI) delta += Math.PI * 2;

            if (delta > 0) {
                this.angle += this.TURN_RATE;
            } else {
                this.angle -= this.TURN_RATE;
            }

            if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
                this.rotation = targetAngle;
            }
        }

        this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
        this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;

        if (game.physics.arcade.distanceToXY(this, this.nextPosition.x, this.nextPosition.y) < 10) {
            this.body.velocity.setTo(0, 0);
            this.nextPosition = {
                x: null,
                y: null
            };
        }
    }
};